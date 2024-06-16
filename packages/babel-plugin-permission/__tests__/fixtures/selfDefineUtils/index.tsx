/**
 * 权限定义帮助函数
 * @param permission 权限信息
 */
export const definePermission = (permission: any): any => {
  const createdPermission: any = {
    ...permission,
  };

  if (!createdPermission.type) {
    createdPermission.type = 'OPERATE';
  }

  return createdPermission;
};

/**
 * 权限批量定义帮助函数
 * @param permissions 权限集
 */
export const definePermissions = <T extends Record<string, any>>(definePermissions: T): T => {
  const temp: Record<string, any> = {};
  Object.keys(definePermissions).forEach((key) => {
    temp[key] = definePermission(definePermissions[key]);
  });

  return temp as T;
};
