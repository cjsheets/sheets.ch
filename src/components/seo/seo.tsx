import React from 'react';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import config from '../../config';

interface ISEO {
  postNode?: any;
  postPath?: any;
  postSEO?: boolean;
  title?: string;
}

export default function SEO({ postNode, postPath, postSEO, title: titleOverride }: ISEO) {
  let title = titleOverride;
  let description;
  let image;
  let postURL;

  if (postSEO) {
    const postMeta = postNode.frontmatter;
    ({ title } = postMeta);
    description = postMeta.description ? postMeta.description : postNode.excerpt;
    postURL = config.siteUrl + postPath;
  } else {
    title = config.siteTitle;
    description = config.siteDescription;
    image = config.siteLogo;
  }

  const getImagePath = (imageURI) => {
    if (!imageURI?.match(`(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]`))
      return config.siteUrl + imageURI;

    return imageURI;
  };

  const getPublicationDate = () => {
    if (!postNode) return null;

    if (!postNode.frontmatter) return null;

    if (!postNode.frontmatter.date) return null;

    return moment(postNode.frontmatter.date, config.dateFromFormat).toDate();
  };

  image = getImagePath(image);

  const datePublished = getPublicationDate();

  const authorJSONLD = {
    '@type': 'Person',
    name: config.userName,
    email: config.userEmail,
    address: config.userLocation,
  };

  const logoJSONLD = {
    '@type': 'ImageObject',
    url: getImagePath(config.siteLogo),
  };

  const blogURL = config.siteUrl + config.pathPrefix;
  const schemaOrgJSONLD = [
    {
      '@context': 'http://schema.org',
      '@type': 'WebSite',
      url: blogURL,
      name: title,
      alternateName: config.siteTitleAlt ? config.siteTitleAlt : '',
    },
  ];
  if (postSEO) {
    schemaOrgJSONLD.push(
      {
        '@context': 'http://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            item: {
              '@id': postURL,
              name: title,
              image,
            },
          },
        ],
      } as any,
      {
        '@context': 'http://schema.org',
        '@type': 'BlogPosting',
        url: blogURL,
        name: title,
        alternateName: config.siteTitleAlt ? config.siteTitleAlt : '',
        headline: title,
        image: { '@type': 'ImageObject', url: image },
        author: authorJSONLD,
        publisher: {
          ...authorJSONLD,
          '@type': 'Organization',
          logo: logoJSONLD,
        },
        datePublished,
        description,
      } as any
    );
  }
  return (
    <Helmet>
      <title>{title}</title>
      {/* General tags */}
      <meta name="description" content={description} />
      <meta name="image" content={image} />

      {/* Schema.org tags */}
      <script type="application/ld+json">{JSON.stringify(schemaOrgJSONLD)}</script>

      {/* OpenGraph tags */}
      <meta property="og:url" content={postSEO ? postURL : blogURL} />
      {postSEO ? <meta property="og:type" content="article" /> : null}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="fb:app_id" content={config.siteFBAppID ? config.siteFBAppID : ''} />
    </Helmet>
  );
}
