import { UserRepository } from './entities/user/repository';
import { UserService } from './entities/user/service';
import { UserController } from './entities/user/controller';
import { OrganizationRepository } from './entities/organization/repository';
import { OrganizationService } from './entities/organization/service';
import { OrganizationController } from './entities/organization/controller';
import { WorkspaceRepository } from './entities/workspace/repository';
import { WorkspaceService } from './entities/workspace/service';
import { WorkspaceController } from './entities/workspace/controller';
import { ProjectRepository } from './entities/project/repository';
import { ProjectService } from './entities/project/service';
import { ProjectController } from './entities/project/controller';
import { RepositoryRepository } from './entities/repository/repository';
import { RepositoryService } from './entities/repository/service';
import { RepositoryController } from './entities/repository/controller';
import { PullRequestRepository } from './entities/pullRequest/repository';
import { PullRequestService } from './entities/pullRequest/service';
import { PullRequestController } from './entities/pullRequest/controller';
import { IssueRepository } from './entities/issue/repository';
import { IssueService } from './entities/issue/service';
import { IssueController } from './entities/issue/controller';
import { CommentRepository } from './entities/comment/repository';
import { CommentService } from './entities/comment/service';
import { CommentController } from './entities/comment/controller';
import { ReviewRepository } from './entities/review/repository';
import { ReviewService } from './entities/review/service';
import { ReviewController } from './entities/review/controller';
import { NotificationRepository } from './entities/notification/repository';
import { NotificationService } from './entities/notification/service';
import { NotificationController } from './entities/notification/controller';
import { TeamRepository } from './entities/team/repository';
import { TeamService } from './entities/team/service';
import { TeamController } from './entities/team/controller';
import { MembershipRepository } from './entities/membership/repository';
import { MembershipService } from './entities/membership/service';
import { MembershipController } from './entities/membership/controller';
import { InvitationRepository } from './entities/invitation/repository';
import { InvitationService } from './entities/invitation/service';
import { InvitationController } from './entities/invitation/controller';
import { ApiKeyRepository } from './entities/apiKey/repository';
import { ApiKeyService } from './entities/apiKey/service';
import { ApiKeyController } from './entities/apiKey/controller';
import { WebhookRepository } from './entities/webhook/repository';
import { WebhookService } from './entities/webhook/service';
import { WebhookController } from './entities/webhook/controller';
import { DeploymentRepository } from './entities/deployment/repository';
import { DeploymentService } from './entities/deployment/service';
import { DeploymentController } from './entities/deployment/controller';
import { EnvironmentRepository } from './entities/environment/repository';
import { EnvironmentService } from './entities/environment/service';
import { EnvironmentController } from './entities/environment/controller';
import { AuditLogRepository } from './entities/auditLog/repository';
import { AuditLogService } from './entities/auditLog/service';
import { AuditLogController } from './entities/auditLog/controller';
import { BillingAccountRepository } from './entities/billingAccount/repository';
import { BillingAccountService } from './entities/billingAccount/service';
import { BillingAccountController } from './entities/billingAccount/controller';
import { InvoiceRepository } from './entities/invoice/repository';
import { InvoiceService } from './entities/invoice/service';
import { InvoiceController } from './entities/invoice/controller';
import { SubscriptionRepository } from './entities/subscription/repository';
import { SubscriptionService } from './entities/subscription/service';
import { SubscriptionController } from './entities/subscription/controller';
import { UsageRecordRepository } from './entities/usageRecord/repository';
import { UsageRecordService } from './entities/usageRecord/service';
import { UsageRecordController } from './entities/usageRecord/controller';
import { SessionRepository } from './entities/session/repository';
import { SessionService } from './entities/session/service';
import { SessionController } from './entities/session/controller';
import { OauthGrantRepository } from './entities/oauthGrant/repository';
import { OauthGrantService } from './entities/oauthGrant/service';
import { OauthGrantController } from './entities/oauthGrant/controller';
import { FeatureFlagRepository } from './entities/featureFlag/repository';
import { FeatureFlagService } from './entities/featureFlag/service';
import { FeatureFlagController } from './entities/featureFlag/controller';

export * from './entities/user/model';
export * from './entities/user/repository';
export * from './entities/user/service';
export * from './entities/user/controller';
export * from './entities/user/validator';
export * from './entities/organization/model';
export * from './entities/organization/repository';
export * from './entities/organization/service';
export * from './entities/organization/controller';
export * from './entities/organization/validator';
export * from './entities/workspace/model';
export * from './entities/workspace/repository';
export * from './entities/workspace/service';
export * from './entities/workspace/controller';
export * from './entities/workspace/validator';
export * from './entities/project/model';
export * from './entities/project/repository';
export * from './entities/project/service';
export * from './entities/project/controller';
export * from './entities/project/validator';
export * from './entities/repository/model';
export * from './entities/repository/repository';
export * from './entities/repository/service';
export * from './entities/repository/controller';
export * from './entities/repository/validator';
export * from './entities/pullRequest/model';
export * from './entities/pullRequest/repository';
export * from './entities/pullRequest/service';
export * from './entities/pullRequest/controller';
export * from './entities/pullRequest/validator';
export * from './entities/issue/model';
export * from './entities/issue/repository';
export * from './entities/issue/service';
export * from './entities/issue/controller';
export * from './entities/issue/validator';
export * from './entities/comment/model';
export * from './entities/comment/repository';
export * from './entities/comment/service';
export * from './entities/comment/controller';
export * from './entities/comment/validator';
export * from './entities/review/model';
export * from './entities/review/repository';
export * from './entities/review/service';
export * from './entities/review/controller';
export * from './entities/review/validator';
export * from './entities/notification/model';
export * from './entities/notification/repository';
export * from './entities/notification/service';
export * from './entities/notification/controller';
export * from './entities/notification/validator';
export * from './entities/team/model';
export * from './entities/team/repository';
export * from './entities/team/service';
export * from './entities/team/controller';
export * from './entities/team/validator';
export * from './entities/membership/model';
export * from './entities/membership/repository';
export * from './entities/membership/service';
export * from './entities/membership/controller';
export * from './entities/membership/validator';
export * from './entities/invitation/model';
export * from './entities/invitation/repository';
export * from './entities/invitation/service';
export * from './entities/invitation/controller';
export * from './entities/invitation/validator';
export * from './entities/apiKey/model';
export * from './entities/apiKey/repository';
export * from './entities/apiKey/service';
export * from './entities/apiKey/controller';
export * from './entities/apiKey/validator';
export * from './entities/webhook/model';
export * from './entities/webhook/repository';
export * from './entities/webhook/service';
export * from './entities/webhook/controller';
export * from './entities/webhook/validator';
export * from './entities/deployment/model';
export * from './entities/deployment/repository';
export * from './entities/deployment/service';
export * from './entities/deployment/controller';
export * from './entities/deployment/validator';
export * from './entities/environment/model';
export * from './entities/environment/repository';
export * from './entities/environment/service';
export * from './entities/environment/controller';
export * from './entities/environment/validator';
export * from './entities/auditLog/model';
export * from './entities/auditLog/repository';
export * from './entities/auditLog/service';
export * from './entities/auditLog/controller';
export * from './entities/auditLog/validator';
export * from './entities/billingAccount/model';
export * from './entities/billingAccount/repository';
export * from './entities/billingAccount/service';
export * from './entities/billingAccount/controller';
export * from './entities/billingAccount/validator';
export * from './entities/invoice/model';
export * from './entities/invoice/repository';
export * from './entities/invoice/service';
export * from './entities/invoice/controller';
export * from './entities/invoice/validator';
export * from './entities/subscription/model';
export * from './entities/subscription/repository';
export * from './entities/subscription/service';
export * from './entities/subscription/controller';
export * from './entities/subscription/validator';
export * from './entities/usageRecord/model';
export * from './entities/usageRecord/repository';
export * from './entities/usageRecord/service';
export * from './entities/usageRecord/controller';
export * from './entities/usageRecord/validator';
export * from './entities/session/model';
export * from './entities/session/repository';
export * from './entities/session/service';
export * from './entities/session/controller';
export * from './entities/session/validator';
export * from './entities/oauthGrant/model';
export * from './entities/oauthGrant/repository';
export * from './entities/oauthGrant/service';
export * from './entities/oauthGrant/controller';
export * from './entities/oauthGrant/validator';
export * from './entities/featureFlag/model';
export * from './entities/featureFlag/repository';
export * from './entities/featureFlag/service';
export * from './entities/featureFlag/controller';
export * from './entities/featureFlag/validator';

import type { HttpRoute } from './entities/user/controller';

export function buildRoutes(): HttpRoute[] {
  const routes: HttpRoute[] = [];
{
  const repo = new UserRepository();
  const service = new UserService({ repository: repo });
  const ctrl = new UserController(service);
  ctrl.register(routes);
}

{
  const repo = new OrganizationRepository();
  const service = new OrganizationService({ repository: repo });
  const ctrl = new OrganizationController(service);
  ctrl.register(routes);
}

{
  const repo = new WorkspaceRepository();
  const service = new WorkspaceService({ repository: repo });
  const ctrl = new WorkspaceController(service);
  ctrl.register(routes);
}

{
  const repo = new ProjectRepository();
  const service = new ProjectService({ repository: repo });
  const ctrl = new ProjectController(service);
  ctrl.register(routes);
}

{
  const repo = new RepositoryRepository();
  const service = new RepositoryService({ repository: repo });
  const ctrl = new RepositoryController(service);
  ctrl.register(routes);
}

{
  const repo = new PullRequestRepository();
  const service = new PullRequestService({ repository: repo });
  const ctrl = new PullRequestController(service);
  ctrl.register(routes);
}

{
  const repo = new IssueRepository();
  const service = new IssueService({ repository: repo });
  const ctrl = new IssueController(service);
  ctrl.register(routes);
}

{
  const repo = new CommentRepository();
  const service = new CommentService({ repository: repo });
  const ctrl = new CommentController(service);
  ctrl.register(routes);
}

{
  const repo = new ReviewRepository();
  const service = new ReviewService({ repository: repo });
  const ctrl = new ReviewController(service);
  ctrl.register(routes);
}

{
  const repo = new NotificationRepository();
  const service = new NotificationService({ repository: repo });
  const ctrl = new NotificationController(service);
  ctrl.register(routes);
}

{
  const repo = new TeamRepository();
  const service = new TeamService({ repository: repo });
  const ctrl = new TeamController(service);
  ctrl.register(routes);
}

{
  const repo = new MembershipRepository();
  const service = new MembershipService({ repository: repo });
  const ctrl = new MembershipController(service);
  ctrl.register(routes);
}

{
  const repo = new InvitationRepository();
  const service = new InvitationService({ repository: repo });
  const ctrl = new InvitationController(service);
  ctrl.register(routes);
}

{
  const repo = new ApiKeyRepository();
  const service = new ApiKeyService({ repository: repo });
  const ctrl = new ApiKeyController(service);
  ctrl.register(routes);
}

{
  const repo = new WebhookRepository();
  const service = new WebhookService({ repository: repo });
  const ctrl = new WebhookController(service);
  ctrl.register(routes);
}

{
  const repo = new DeploymentRepository();
  const service = new DeploymentService({ repository: repo });
  const ctrl = new DeploymentController(service);
  ctrl.register(routes);
}

{
  const repo = new EnvironmentRepository();
  const service = new EnvironmentService({ repository: repo });
  const ctrl = new EnvironmentController(service);
  ctrl.register(routes);
}

{
  const repo = new AuditLogRepository();
  const service = new AuditLogService({ repository: repo });
  const ctrl = new AuditLogController(service);
  ctrl.register(routes);
}

{
  const repo = new BillingAccountRepository();
  const service = new BillingAccountService({ repository: repo });
  const ctrl = new BillingAccountController(service);
  ctrl.register(routes);
}

{
  const repo = new InvoiceRepository();
  const service = new InvoiceService({ repository: repo });
  const ctrl = new InvoiceController(service);
  ctrl.register(routes);
}

{
  const repo = new SubscriptionRepository();
  const service = new SubscriptionService({ repository: repo });
  const ctrl = new SubscriptionController(service);
  ctrl.register(routes);
}

{
  const repo = new UsageRecordRepository();
  const service = new UsageRecordService({ repository: repo });
  const ctrl = new UsageRecordController(service);
  ctrl.register(routes);
}

{
  const repo = new SessionRepository();
  const service = new SessionService({ repository: repo });
  const ctrl = new SessionController(service);
  ctrl.register(routes);
}

{
  const repo = new OauthGrantRepository();
  const service = new OauthGrantService({ repository: repo });
  const ctrl = new OauthGrantController(service);
  ctrl.register(routes);
}

{
  const repo = new FeatureFlagRepository();
  const service = new FeatureFlagService({ repository: repo });
  const ctrl = new FeatureFlagController(service);
  ctrl.register(routes);
}
  return routes;
}
