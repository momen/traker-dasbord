import React from 'react'
import { useStateValue } from '../StateProvider';

function PermissionGuard({children, permission}) {
    const [{ userPermissions }] = useStateValue();

  return userPermissions?.includes(permission) ? children : <h1>No Access</h1>
}

export default PermissionGuard
