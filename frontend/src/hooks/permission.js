export const permissionsByRole = {
  admin: {
    dashboard: true,
    classes: true,
    classroom: true,
    article: true,
    boite: true,

    add: true,
    edit: true,
    delete: true,
    view: true,
    export: true,
    trash: true,
    log: true,
  },

  secretary: {
    dashboard: false,
    service: true,
    stock: true,
    article: true,

    add: true,
    edit: true,
    delete: false,
    view: true,
    export: true,
    trash: false,
    log: false,
  },
};

export const can = (role, action) => {
  return permissionsByRole[role]?.[action] === true;
};
