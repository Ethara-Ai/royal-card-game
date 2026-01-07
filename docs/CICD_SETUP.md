# CI/CD Pipeline Setup Guide

This document provides comprehensive instructions for setting up the CI/CD pipeline for deploying the application to AWS S3 with CloudFront distribution.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Prerequisites](#prerequisites)
4. [AWS Infrastructure Setup](#aws-infrastructure-setup)
5. [GitHub Configuration](#github-configuration)
6. [Workflow Files](#workflow-files)
7. [Environment Variables and Secrets](#environment-variables-and-secrets)
8. [Deployment Process](#deployment-process)
9. [Troubleshooting](#troubleshooting)
10. [Security Considerations](#security-considerations)

---

## Overview

The CI/CD pipeline automates the build, test, and deployment process for the application. It uses GitHub Actions to orchestrate the workflow and deploys static assets to AWS S3 with CloudFront as the CDN.

### Key Features

- Automated testing and linting on every pull request
- Separate staging and production deployment pipelines
- OIDC-based authentication with AWS (no long-lived credentials)
- CloudFront cache invalidation for immediate updates
- Build artifact versioning and traceability
- Comprehensive error handling and notifications

---

## Architecture

```
                                    GitHub Actions
                                         |
                    +--------------------+--------------------+
                    |                    |                    |
              Pull Request          Push to develop      Push to main
                    |                    |                    |
              PR Validation         Staging Deploy     Production Deploy
                    |                    |                    |
              Quality Gates         Build & Test        Build & Test
                    |                    |                    |
                    v                    v                    v
              Lint + Test         S3 (Staging)        S3 (Production)
                                        |                    |
                                  CloudFront            CloudFront
                                   (Staging)           (Production)
```

---

## Prerequisites

Before setting up the pipeline, ensure you have:

1. **AWS Account** with appropriate permissions
2. **GitHub Repository** with admin access
3. **AWS CLI** installed locally for infrastructure setup
4. **Node.js 20+** installed locally for testing

---

## AWS Infrastructure Setup

### Option 1: Using CloudFormation (Recommended)

Deploy the infrastructure using the provided CloudFormation template:

```bash
# Deploy production environment
aws cloudformation deploy \
  --template-file infrastructure/cloudformation-s3-hosting.yml \
  --stack-name royal-card-game-production \
  --parameter-overrides \
    Environment=production \
    GitHubOrg=YOUR_GITHUB_ORG \
    GitHubRepo=YOUR_REPO_NAME \
  --capabilities CAPABILITY_NAMED_IAM

# Deploy staging environment
aws cloudformation deploy \
  --template-file infrastructure/cloudformation-s3-hosting.yml \
  --stack-name royal-card-game-staging \
  --parameter-overrides \
    Environment=staging \
    GitHubOrg=YOUR_GITHUB_ORG \
    GitHubRepo=YOUR_REPO_NAME \
  --capabilities CAPABILITY_NAMED_IAM
```

### Option 2: Manual Setup

If you prefer manual setup, follow these steps:

#### 1. Create S3 Bucket

```bash
# Create the bucket
aws s3 mb s3://your-app-production --region us-east-1

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket your-app-production \
  --versioning-configuration Status=Enabled

# Block public access
aws s3api put-public-access-block \
  --bucket your-app-production \
  --public-access-block-configuration \
    BlockPublicAcls=true,\
    IgnorePublicAcls=true,\
    BlockPublicPolicy=true,\
    RestrictPublicBuckets=true
```

#### 2. Create CloudFront Distribution

Create a CloudFront distribution with the following configuration:

- **Origin**: S3 bucket with Origin Access Control (OAC)
- **Default Root Object**: `index.html`
- **Viewer Protocol Policy**: Redirect HTTP to HTTPS
- **Cache Behavior**: Customize based on file types
- **Error Pages**: Configure 403/404 to return `index.html` for SPA routing

#### 3. Configure GitHub OIDC Provider

```bash
# Create the OIDC provider
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1
```

#### 4. Create IAM Role for GitHub Actions

Create an IAM role with the trust policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:YOUR_ORG/YOUR_REPO:*"
        }
      }
    }
  ]
}
```

Attach the permissions policy from `.github/aws-iam-policy.json`.

---

## GitHub Configuration

### Repository Secrets

Navigate to **Settings > Secrets and variables > Actions** and add the following secrets:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `AWS_ROLE_ARN` | IAM role ARN for production deployments | `arn:aws:iam::123456789:role/github-actions-prod` |
| `AWS_STAGING_ROLE_ARN` | IAM role ARN for staging deployments | `arn:aws:iam::123456789:role/github-actions-staging` |
| `AWS_STAGING_S3_BUCKET` | S3 bucket name for staging | `my-app-staging` |

### Repository Variables

Navigate to **Settings > Secrets and variables > Actions > Variables** and add:

| Variable Name | Description | Example |
|---------------|-------------|---------|
| `AWS_REGION` | AWS region for deployment | `us-east-1` |
| `S3_BUCKET_PRODUCTION` | S3 bucket name for production | `my-app-production` |
| `CLOUDFRONT_DISTRIBUTION_ID_PRODUCTION` | CloudFront distribution ID | `E1234567890ABC` |
| `PRODUCTION_URL` | Production website URL | `https://example.com` |
| `STAGING_URL` | Staging website URL | `https://staging.example.com` |
| `STAGING_CLOUDFRONT_DISTRIBUTION_ID` | Staging CloudFront distribution ID | `E0987654321XYZ` |

### Environment Protection Rules

Configure environment protection for production:

1. Go to **Settings > Environments**
2. Create `production` environment
3. Enable **Required reviewers** (optional but recommended)
4. Add **Deployment branches** restriction to `main` only

---

## Workflow Files

The pipeline consists of three workflow files:

### 1. Production Deployment (`.github/workflows/deploy-production.yml`)

Triggers on:
- Push to `main` branch
- Manual workflow dispatch

Jobs:
- **lint**: Code quality checks (ESLint, Prettier)
- **test**: Unit tests with coverage
- **build**: Production build with artifact generation
- **deploy**: S3 sync and CloudFront invalidation
- **verify**: Post-deployment health checks

### 2. Staging Deployment (`.github/workflows/deploy-staging.yml`)

Triggers on:
- Push to `develop` branch
- Push to `feature/**` branches
- Pull requests to `main` or `develop`

Jobs:
- **quality-check**: Linting and tests
- **build**: Staging build
- **deploy**: Deploy to staging S3 bucket

### 3. Pull Request Validation (`.github/workflows/pull-request.yml`)

Triggers on:
- Pull requests to `main` or `develop`

Jobs:
- **quality**: Linting and formatting checks
- **test**: Full test suite with coverage
- **build**: Build verification
- **security**: npm audit for vulnerabilities

---

## Environment Variables and Secrets

### Build-time Environment Variables

The following variables are available during build:

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | Build environment (`production`, `staging`) |
| `VITE_APP_ENV` | Application environment identifier |
| `VITE_BUILD_ID` | Unique build identifier (commit SHA) |
| `VITE_API_URL` | API endpoint URL (if applicable) |

### Adding Custom Environment Variables

To add custom variables:

1. Add the variable to GitHub repository variables
2. Reference it in the workflow file:

```yaml
- name: Build Application
  run: npm run build
  env:
    VITE_CUSTOM_VAR: ${{ vars.CUSTOM_VAR }}
```

---

## Deployment Process

### Production Deployment Flow

1. Developer merges PR to `main` branch
2. GitHub Actions triggers production workflow
3. Code quality checks run (linting, formatting)
4. Test suite executes
5. Production build is created
6. Build manifest is generated with metadata
7. Assets are synced to S3 with appropriate cache headers
8. CloudFront cache is invalidated
9. Deployment is verified via health check

### Cache Strategy

| File Type | Cache Duration | Rationale |
|-----------|---------------|-----------|
| `/assets/*` | 1 year (immutable) | Hashed filenames enable aggressive caching |
| `index.html` | No cache | Ensures users always get the latest version |
| `*.json` | No cache | Configuration files should update immediately |
| Other files | 24 hours | Balance between freshness and performance |

### Rollback Procedure

To rollback to a previous version:

1. Identify the commit SHA of the desired version
2. Trigger manual workflow dispatch:

```bash
gh workflow run deploy-production.yml --ref <commit-sha>
```

Or use the GitHub UI:
1. Go to **Actions > Production Deployment**
2. Click **Run workflow**
3. Select the branch/tag to deploy

---

## Troubleshooting

### Common Issues

#### 1. AWS Authentication Failures

**Symptom**: `Error: Credentials could not be loaded`

**Solutions**:
- Verify the IAM role ARN is correct
- Check the trust policy includes the correct repository
- Ensure the OIDC provider thumbprint is current

#### 2. S3 Access Denied

**Symptom**: `AccessDenied: Access Denied` during sync

**Solutions**:
- Verify the IAM role has `s3:PutObject`, `s3:GetObject`, `s3:DeleteObject`, `s3:ListBucket` permissions
- Check the bucket policy allows the role
- Verify the bucket name is correct

#### 3. CloudFront Invalidation Fails

**Symptom**: `AccessDenied` when creating invalidation

**Solutions**:
- Verify the IAM role has `cloudfront:CreateInvalidation` permission
- Check the distribution ID is correct
- Ensure the resource ARN in the policy matches the distribution

#### 4. Build Fails

**Symptom**: `npm run build` fails in CI

**Solutions**:
- Check Node.js version matches local development
- Verify all dependencies are in `package.json`
- Review build logs for specific errors

### Debug Mode

To enable verbose logging in workflows, add:

```yaml
env:
  ACTIONS_STEP_DEBUG: true
```

Or set the repository secret `ACTIONS_STEP_DEBUG` to `true`.

---

## Security Considerations

### OIDC Authentication

The pipeline uses OpenID Connect (OIDC) for AWS authentication, eliminating the need for long-lived access keys:

- Short-lived credentials (15-minute default)
- No secrets stored in GitHub
- Automatic credential rotation
- Audit trail in AWS CloudTrail

### Least Privilege Access

The IAM policies follow the principle of least privilege:

- Only necessary S3 actions are allowed
- CloudFront permissions limited to invalidation
- Resources are scoped to specific buckets and distributions

### Branch Protection

Recommended branch protection rules for `main`:

- Require pull request reviews
- Require status checks to pass
- Require branches to be up to date
- Do not allow bypassing the above settings

### Dependency Security

The pipeline includes:

- `npm audit` for vulnerability scanning
- Dependabot alerts (configure separately)
- Lock file (`package-lock.json`) for reproducible builds

### Content Security Policy

The CloudFormation template configures security headers:

- Content-Security-Policy
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict-Transport-Security
- Referrer-Policy

---

## Maintenance

### Regular Tasks

1. **Update GitHub Actions versions**: Check for new versions of actions quarterly
2. **Review IAM permissions**: Audit and tighten permissions as needed
3. **Monitor costs**: Review S3 and CloudFront usage monthly
4. **Update Node.js version**: Keep in sync with LTS releases

### Updating Workflow Actions

When updating action versions:

1. Review the changelog for breaking changes
2. Test in staging environment first
3. Update all workflows consistently

Example update:

```yaml
# Before
uses: actions/checkout@v3

# After
uses: actions/checkout@v4
```

---

## Support

For issues with the CI/CD pipeline:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review GitHub Actions workflow logs
3. Check AWS CloudTrail for authentication issues
4. Open an issue in the repository with:
   - Workflow run URL
   - Error messages
   - Steps to reproduce