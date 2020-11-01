function deleteEvent(req, res, next) {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'vet')) {
      next();
    } else {
      return res.status(403).send({ error: 'User should have admin/vet access to use this endpoint' });
    }
  }
  
  module.exports = {
    deleteEvent,
  };
  