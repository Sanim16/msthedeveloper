# msthedeveloper.com

Personal portfolio for Momoh Sani Musa — Senior DevOps / Platform Engineer.

## Stack

- React + TypeScript
- Vite
- Static hosting
- Designed for AWS S3 + CloudFront
- Terraform for AWS infrastructure
- GitHub Actions for CI/CD

## Local development

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

The build output is generated in `dist/`.


## Planned AWS architecture

```text
Route 53
   │
   ▼
CloudFront
   │
   │ Origin Access Control
   ▼
Private S3 bucket
```

ACM for CloudFront must be provisioned in `us-east-1`.

Use GitHub Actions OIDC rather than long-lived AWS access keys for deployment.
## AWS infrastructure

Terraform lives under `terraform/` and uses an existing S3 bucket for remote state. The state bucket is in `us-east-1`, has versioning enabled, and uses KMS encryption. Terraform's S3 `use_lockfile` is enabled for state locking.

Website architecture: Route 53 -> CloudFront -> private S3 using CloudFront Origin Access Control. The CloudFront ACM certificate is created in `us-east-1`; the website bucket is in `eu-central-1`. The domain registration itself is deliberately not managed by Terraform.

### First deployment

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
terraform init
terraform plan
terraform apply
terraform output route53_nameservers
```

### GitHub configuration

Add repository variables:
- `SITE_BUCKET_NAME` = `terraform output -raw site_bucket_name`
- `CLOUDFRONT_DISTRIBUTION_ID` = `terraform output -raw cloudfront_distribution_id`

Add repository secret:
- `AWS_DEPLOY_ROLE_ARN` = `terraform output -raw github_deploy_role_arn`

The workflow uses GitHub OIDC and is restricted by IAM to `Sanim16/msthedeveloper` on the `main` branch. It builds the Vite app, syncs `dist/` to private S3, and invalidates CloudFront.
