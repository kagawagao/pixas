import { definePermission, UserPermissionAuthorize } from '@pixas/user-permission';

export const UsedWithDefinedPermission = () => {
  const permission = definePermission({
    code: 'user-permission-test-define',
    name: '用户权限定义测试',
    description: '用户权限',
    type: 'MENU',
    groups: ['a', 'b'],
  });

  return (
    <UserPermissionAuthorize {...permission}>
      <button>test</button>
    </UserPermissionAuthorize>
  );
};
