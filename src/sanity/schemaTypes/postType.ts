import { DocumentTextIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const postType = defineType({
  name: "post",
  title: "Post",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "canonicalUrl",
      title: "Canonical URL",
      type: "url",
    }),
    defineField({
      name: "ogTitle",
      title: "OG Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "ogDescription",
      title: "OG Description",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "ogImage",
      title: "OG Image",
      type: "image",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "ogUrl",
      title: "OG URL",
      type: "url",
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "ogTitle",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishedAt",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "readTime",
      title: "Read Time (in minutes)",
      type: "number",
      validation: (Rule) => Rule.required().min(1),
    }),

    defineField({
      name: "body",
      title: "Body Content",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
        }),
        defineArrayMember({
          name: "image",
          title: "Image",
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              type: "string",
              title: "Alternative Text",
            }),
          ],
        }),
        defineArrayMember({
          name: "youtube",
          title: "YouTube Video",
          type: "object",
          fields: [
            defineField({
              name: "url",
              title: "YouTube URL",
              type: "url",
              validation: (Rule) =>
                Rule.uri({
                  scheme: ["http", "https"],
                  allowRelative: false,
                }).required(),
            }),
          ],
          preview: {
            select: { title: "url" },
            prepare({ title }) {
              return { title: `📹 YouTube Video: ${title}` };
            },
          },
        }),
      ],
    }),

    defineField({
      name: "headingPairs",
      title: "Heading Pairs",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "h2Heading",
              title: "H2 Heading",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "displayHeading",
              title: "Display Heading",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: "h2Heading",
              subtitle: "displayHeading",
            },
          },
        }),
      ],
    }),

    defineField({
      name: "blogReference",
      title: "Blog Reference",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "post",
              title: "Referenced Blog Post",
              type: "reference",
              to: [{ type: "post" }],
            }),
          ],
          preview: {
            select: {
              title: "post.ogTitle",
            },
            prepare({ title }) {
              return { title: `🔗 Blog Reference: ${title}` };
            },
          },
        }),
      ],
    }),
  ],
  // defineField({
  //   name: 'author',
  //   type: 'reference',
  //   to: {type: 'author'},
  // }),
  // defineField({
  //   name: 'mainImage',
  //   type: 'image',
  //   options: {
  //     hotspot: true,
  //   },
  //   fields: [
  //     defineField({
  //       name: 'alt',
  //       type: 'string',
  //       title: 'Alternative text',
  //     })
  //   ]
  // }),
  // defineField({
  //   name: 'categories',
  //   type: 'array',
  //   of: [defineArrayMember({type: 'reference', to: {type: 'category'}})],
  // }),
  preview: {
    select: {
      title: "ogTitle",
      media: "ogImage",
    },
    prepare(selection) {
      return selection;
    },
  },
});
