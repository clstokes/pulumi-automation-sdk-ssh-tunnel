import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as random from "@pulumi/random";
import * as pulumi from "@pulumi/pulumi";

const project = pulumi.getProject();
const stack = pulumi.getStack();
const tags = { project, stack, Name: `${project}-${stack}` };
const config = new pulumi.Config();

const vpc = new awsx.ec2.Vpc("main", { tags });
export const vpcId = vpc.id;

const amiId = aws.ec2.getAmi({
    owners: ["099720109477"], // Ubuntu
    mostRecent: true,
    filters: [{ name: "name", values: ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"] }],
}).then(it => it.id);

const sshSg = new aws.ec2.SecurityGroup(`ssh`, {
    vpcId: vpc.id,
    ingress: [{ protocol: "tcp", fromPort: 22, toPort: 22, cidrBlocks: ["0.0.0.0/0"] }],
    egress: [{ protocol: "-1", fromPort: 0, toPort: 0, cidrBlocks: ["0.0.0.0/0"] }],
    tags
});

const sshKey = new aws.ec2.KeyPair("main", { publicKey: config.require("publicKey") });

const bastion = new aws.ec2.Instance("bastion", {
    instanceType: aws.ec2.InstanceTypes.T3_Small,
    ami: amiId,
    subnetId: pulumi.output(vpc.publicSubnets)[0].id,
    vpcSecurityGroupIds: [sshSg.id],
    associatePublicIpAddress: true,
    keyName: sshKey.keyName,
    tags,
});

const postgresSg = new aws.ec2.SecurityGroup("postgresdb", {
    vpcId,
    ingress: [{ protocol: "tcp", fromPort: 5432, toPort: 5432, cidrBlocks: [vpc.vpc.cidrBlock] }],
    egress: [{ protocol: "-1", fromPort: 0, toPort: 0, cidrBlocks: [vpc.vpc.cidrBlock] }],
});
const dbSubnets = new aws.rds.SubnetGroup("postgresdb", {
    subnetIds: vpc.privateSubnetIds,
    tags,
});
const password = new random.RandomPassword("postgresdb", {
    length: 32,
    // https://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_CreateDBInstance.html#API_CreateDBInstance_RequestParameters:~:text=The%20password%20for%20the%20master%20user.,character%20except%20%22%2F%22%2C%20%22%22%22%2C%20or%20%22%40%22.
    overrideSpecial: "!#$%&*()-_=+[]{}<>:?",
});
const db = new aws.rds.Instance("postgresdb", {
    engine: "postgres",
    
    instanceClass: "db.t3.xlarge",
    allocatedStorage: 20,
    
    dbSubnetGroupName: dbSubnets.id,
    vpcSecurityGroupIds: [postgresSg.id],
    publiclyAccessible: false,
    
    username: "admin2021",
    password: password.result,
    
    skipFinalSnapshot: true,
    tags,
});

export const bastionHost = bastion.publicIp;
export const dbHost = db.address;
export const dbUsername = db.username;
export const dbPassword = db.password;
