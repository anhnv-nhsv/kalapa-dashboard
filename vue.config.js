module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/" : "/dev",
  devServer: {
    proxy: 'http://172.33.30.19:8082/'
  },
};
