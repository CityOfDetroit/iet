require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
});

module.exports = {
  siteMetadata: {
    title: `IET`,
  },
  pathPrefix: `/iet`,
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-transformer-remark`,
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography.js`,
      },
    },
    {
      resolve: `gatsby-source-airtable`,
      options: {
        apiKey: `${process.env.AIRTABLE_API_KEY}`,
        baseId: `appCFPbAUuYs9JPIv`,
        tableName: `Projects`,
        tableView: `Grid view`
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `src`,
        path: `${__dirname}/src/`,
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-107915075-5",
        // Puts tracking script in the head instead of the body
        head: true,
        // Setting this parameter is optional
        anonymize: true,
      },
    },    
  ],
}
