const { Hacker, HackerApplication } = require('js/server/models');

const getHackerFromEmailOrApplicationSlug = identifier => {
  if (identifier.includes('@')) {
    return Hacker.findOne({
      where: {
        email: identifier
      }
    });
  } else {
    return HackerApplication.findOne({
      where: {
        applicationSlug: identifier
      },
      include: [
        {
          model: Hacker,
          required: true,
        },
      ]
    }).then(hackerApplication => {
      if (hackerApplication === null) {
        return Promise.reject('Could not find a hacker with the specified identifier');
      }
      return Promise.resolve(hackerApplication.hacker);
    });
  }
};

module.exports = { getHackerFromEmailOrApplicationSlug };
