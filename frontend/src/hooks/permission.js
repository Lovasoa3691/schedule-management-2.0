export const permissionsByRole = {
  admin: {
    dashboard: true,
    class: true,
    teacher: true,
    subject: true,
    user: true,
    stats: true,
    config: true,

    add: true,
    edit: true,
    delete: true,
    view: true,
    export: true,
  },

  secretary: {
    dashboard: true,
    class: true,
    teacher: true,
    subject: true,
    user: false,
    stats: true,
    config: false,

    add: true,
    edit: false,
    delete: false,
    view: true,
    export: true,
  },
};

export const can = (role, action) => {
  return permissionsByRole[role]?.[action] === true;
};
