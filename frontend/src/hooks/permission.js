export const permissionsByRole = {
  admin: {
    dashboard: true,
    class: true,
    teacher: true,
    subject: true,
    user: true,
    profil: false,
    stats: true,
    config: true,

    addPlanning: false,
    add: true,
    edit: true,
    delete: true,
    view: true,
    export: true,
    import: true,
  },

  secretary: {
    dashboard: true,
    class: true,
    teacher: true,
    subject: true,
    user: false,
    profil: true,
    stats: true,
    config: false,

    addPlanning: true,
    add: false,
    edit: false,
    delete: false,
    view: true,
    export: true,
    import: false,
  },
};

export const can = (role, action) => {
  return permissionsByRole[role]?.[action] === true;
};
