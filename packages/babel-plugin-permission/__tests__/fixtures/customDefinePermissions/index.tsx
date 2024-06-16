import { customDefinePermissions, UserPermissionAuthorize } from '@pixas/user-permission';

export const UsedWithDefinedPermissions = () => {
  const permissions = customDefinePermissions({
    btn: {
      code: 'user-permission-test-define-permissions',
      name: '用户权限定义测试',
      description: '用户权限',
      groups: ['c'],
    },
  });

  return (
    <UserPermissionAuthorize {...permissions.btn}>
      <button>test</button>
    </UserPermissionAuthorize>
  );
};
