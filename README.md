# pulumi-automation-sdk-ssh-tunnel

This project demonstrates how you can use the [Pulumi Automation SDK](https://www.pulumi.com/blog/automation-api/) to provision resources that require connectivity through a bastion host, establish a connection through the bastion host, and then provision resources through the connection.

## Prerequisites

- You will need the [Pulumi CLI](https://www.pulumi.com/docs/get-started/install/) installed.
- This particular project uses TypeScript so you will need [Node.js](https://nodejs.org/en/download/) installed. This same automation application could be implemented in any of other languages that Pulumi supports.

## Usage

The automation application requires the following **three** arguments:
- the operation to perform - `up`, `refresh`, or `destroy`
- the stack name
- the path to the ssh public key for connecting to the bastion host

e.g.
```
npm run pulumi up dev ~/.ssh/key.pub
```

## Example Output

```
%  npm run pulumi up dev ~/.ssh/key.pub 
> pulumi-automation-sdk-ssh-tunnel@0.0.1 pulumi
> ./node_modules/ts-node/dist/bin.js pulumi.ts "up" "dev" "/Users/clstokes/.ssh/key.pub"
Running [up] on stack [dev]
Updating (dev)

View Live: https://app.pulumi.com/clstokes/vpc/dev/updates/65


 +  pulumi:pulumi:Stack vpc-dev creating 
 +  awsx:x:ec2:Vpc main creating 
 +  aws:ec2:KeyPair main creating 
 +  random:index:RandomPassword postgresdb creating 
 +  random:index:RandomPassword postgresdb created 
 +  awsx:x:ec2:Subnet main-public-0 creating 
 +  awsx:x:ec2:Subnet main-public-1 creating 
 +  awsx:x:ec2:Subnet main-private-1 creating 
 +  awsx:x:ec2:InternetGateway main creating 
 +  awsx:x:ec2:NatGateway main-1 creating 
 +  aws:ec2:Vpc main creating 
 +  awsx:x:ec2:Subnet main-private-0 creating 
 +  awsx:x:ec2:NatGateway main-0 creating 
 +  aws:ec2:KeyPair main created 
 +  aws:ec2:Eip main-1 creating 
 +  aws:ec2:Eip main-0 creating 
 +  aws:ec2:Eip main-1 created 
 +  aws:ec2:Eip main-0 created 
 +  aws:ec2:Vpc main created 
 +  aws:ec2:InternetGateway main creating 
 +  aws:ec2:RouteTable main-public-1 creating 
 +  aws:ec2:Subnet main-public-1 creating 
 +  aws:ec2:Subnet main-public-0 creating 
 +  aws:ec2:Subnet main-private-0 creating 
 +  aws:ec2:RouteTable main-private-0 creating 
 +  aws:ec2:RouteTable main-public-0 creating 
 +  aws:ec2:RouteTable main-private-1 creating 
 +  aws:ec2:Subnet main-private-1 creating 
 +  aws:ec2:SecurityGroup ssh creating 
 +  aws:ec2:SecurityGroup postgresdb creating 
 +  aws:ec2:RouteTable main-public-1 created 
 +  aws:ec2:RouteTable main-private-0 created 
 +  aws:ec2:Subnet main-private-0 created 
 +  aws:ec2:RouteTable main-public-0 created 
 +  aws:ec2:RouteTableAssociation main-private-0 creating 
 +  aws:ec2:RouteTable main-private-1 created 
 +  aws:ec2:Subnet main-private-1 created 
 +  aws:ec2:RouteTableAssociation main-private-1 creating 
 +  aws:ec2:InternetGateway main created 
 +  aws:ec2:Route main-public-1-ig creating 
 +  aws:ec2:Route main-public-0-ig creating 
 +  aws:ec2:RouteTableAssociation main-private-0 created 
 +  aws:ec2:RouteTableAssociation main-private-1 created 
 +  aws:rds:SubnetGroup postgresdb creating 
 +  aws:ec2:Route main-public-1-ig created 
 +  aws:ec2:Route main-public-0-ig created 
 +  aws:ec2:SecurityGroup ssh created 
 +  aws:ec2:SecurityGroup postgresdb created 
 +  aws:rds:SubnetGroup postgresdb created 
 +  aws:rds:Instance postgresdb creating 
 +  aws:ec2:Subnet main-public-0 created 
 +  aws:ec2:Subnet main-public-1 created 
 +  aws:ec2:RouteTableAssociation main-public-0 creating 
 +  aws:ec2:RouteTableAssociation main-public-1 creating 
 +  aws:ec2:RouteTableAssociation main-public-0 created 
 +  aws:ec2:RouteTableAssociation main-public-1 created 
 +  aws:ec2:NatGateway main-0 creating 
 +  aws:ec2:Instance bastion creating 
 +  aws:ec2:NatGateway main-1 creating 
 +  aws:ec2:Instance bastion created 
 +  aws:ec2:NatGateway main-0 created 
 +  aws:ec2:NatGateway main-1 created 
 +  aws:ec2:Route main-private-0-nat-0 creating 
 +  aws:ec2:Route main-private-1-nat-1 creating 
 +  aws:ec2:Route main-private-1-nat-1 created 
 +  aws:ec2:Route main-private-0-nat-0 created 
 +  aws:rds:Instance postgresdb created 
 +  pulumi:pulumi:Stack vpc-dev created 
 
Outputs:
    bastionHost: "3.220.232.157"
    dbHost     : "postgresdb987bfbc.c3vf5g3d8zs9.us-east-1.rds.amazonaws.com"
    dbPassword : "[secret]"
    dbUsername : "admin2021"
    vpcId      : "vpc-06e9ccae6be527e0d"
Resources:
    + 38 created
Duration: 3m51s

################################################################################
#
# Establishing tunnel through [3.220.232.157] to [postgresdb987bfbc.c3vf5g3d8zs9.us-east-1.rds.amazonaws.com] on port [5432]...
#
################################################################################
Updating (dev)

View Live: https://app.pulumi.com/clstokes/database/dev/updates/65


 +  pulumi:pulumi:Stack database-dev creating 
 +  postgresql:index:Database main3 creating 
 +  postgresql:index:Database main1 creating 
 +  postgresql:index:Database main2 creating 
 +  postgresql:index:Database main3 created 
 +  postgresql:index:Database main1 created 
 +  postgresql:index:Database main2 created 
 +  pulumi:pulumi:Stack database-dev created 
 
Resources:
    + 4 created
Duration: 13s

################################################################################
#
# Stopping tunnel...
#
################################################################################
% 
```
