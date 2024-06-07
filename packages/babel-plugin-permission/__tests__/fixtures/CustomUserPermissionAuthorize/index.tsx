import { CustomUserPermissionAuthorize, definePermission } from '@pixas/user-permission';

definePermission({
  code: 'user-permission-test-define',
  name: '用户权限定义测试',
  description: '用户权限',
  groups: ['d'],
});

export default () => (
  <CustomUserPermissionAuthorize code="user-permission-test" name="用户权限测试" description="用户权限" groups={['d']}>
    <button>test</button>
  </CustomUserPermissionAuthorize>
);
