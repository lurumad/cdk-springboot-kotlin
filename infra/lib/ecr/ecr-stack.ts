import * as cdk from 'aws-cdk-lib';
import { RemovalPolicy } from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import { Construct } from 'constructs';

interface EcrStackProps extends cdk.StackProps {
    suffix: string;
}

export class EcrStack extends cdk.Stack {
    public repository: ecr.Repository;

    constructor(scope: Construct, id: string, props: EcrStackProps) {
        super(scope, id, props);

        this.repository = new ecr.Repository(this, 'ecr', {
            repositoryName: 'todos',
            removalPolicy: RemovalPolicy.DESTROY,
        });
    }
}