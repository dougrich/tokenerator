module.exports = {
  webpack: config => {
    config.module.rules.push({
      test: /\.md$/,
      use: [
        { loader: 'html-loader' },
        { loader: 'markdown-loader' }
      ]
    })
    return config
  }
}
