import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

interface VpcStackProps extends cdk.StackProps {
    prefix: string;
}

export class VpcStack extends cdk.Stack {
    public vpc: ec2.Vpc;

    constructor(scope: Construct, id: string, props: VpcStackProps) {
        super(scope, id, props);

        this.vpc = new ec2.Vpc(this, 'vpc', {
            vpcName: `vpc${props.prefix}`,
            maxAzs: 3,
        });
    }
}