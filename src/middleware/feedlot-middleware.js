function feedlotGuard(req, res, next) {
    if(req.user&& (
      req.user.feedlot_id === parseInt(req.query.feedlot_id) ||
      req.user.feedlot_id === parseInt(req.body.feedlot_id) ||
      req.user.feedlot_id === parseInt(req.params.feedlot_id)
    )) {
      next();
    } else {
      return res.status(403).send({ error: 'User dosen\'t have access to this feedlot' });
    }
  }
  
  module.exports = {
    feedlotGuard,
  };
  