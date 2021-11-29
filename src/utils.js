module.exports = {
  isAnon(user) {
    return !user || user.identities[0].providerType === 'anon-user';
  },
};
