import * as cdk from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import { Construct } from 'constructs';

interface EcrStackProps extends cdk.StackProps {
    prefix: string;
}

export class EcrStack extends cdk.Stack {
    public repository: ecr.Repository;

    constructor(scope: Construct, id: string, props: EcrStackProps) {
        super(scope, id, props);

        this.repository = new ecr.Repository(this, 'ecr', {
            repositoryName: `ecr${props.prefix}`,
        });
    }
}