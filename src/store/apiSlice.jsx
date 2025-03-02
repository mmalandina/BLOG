import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://blog-platform.kata.academy/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('Authorization', `Token ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Articles', 'User'],
  endpoints: (builder) => ({
    getArticles: builder.query({
      query: (page = 1) => {
        const limit = 5;
        const offset = (page - 1) * limit;
        return `/articles?limit=${limit}&offset=${offset}`;
      },
      transformResponse: (response) => ({
        articles: response.articles,
        articlesCount: response.articlesCount,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.articles.map(({ slug }) => ({
                type: 'Articles',
                id: slug,
              })),
              { type: 'Articles', id: 'LIST' },
            ]
          : [{ type: 'Articles', id: 'LIST' }],
    }),
    getArticle: builder.query({
      query: (slug) => `/articles/${slug}`,
      transformResponse: (response) => response.article,
      providesTags: (result, error, slug) => [{ type: 'Articles', id: slug }],
    }),
    getUser: builder.query({
      query: () => '/user',
      providesTags: ['User'],
    }),
    registerUser: builder.mutation({
      query: ({ username, email, password }) => ({
        url: '/users',
        method: 'POST',
        body: { user: { username, email, password } },
      }),
    }),
    signInUser: builder.mutation({
      query: ({ email, password }) => ({
        url: '/users/login',
        method: 'POST',
        body: { user: { email, password } },
      }),
    }),
    createArticle: builder.mutation({
      query: ({ title, description, body, tagList }) => ({
        url: '/articles',
        method: 'POST',
        body: { article: { title, description, body, tagList } },
      }),
      invalidatesTags: [{ type: 'Articles', id: 'LIST' }],
    }),
    editArticle: builder.mutation({
      query: ({ slug, title, description, body, tagList }) => ({
        url: `/articles/${slug}`,
        method: 'PUT',
        body: { article: { title, description, body, tagList } },
      }),
      invalidatesTags: (result, error, { slug }) => [
        { type: 'Articles', id: slug },
      ],
    }),
    deleteArticle: builder.mutation({
      query: (slug) => ({
        url: `/articles/${slug}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Articles', id: 'LIST' }],
    }),
    favoriteArticle: builder.mutation({
      query: (slug) => ({
        url: `/articles/${slug}/favorite`,
        method: 'POST',
      }),
      async onQueryStarted(slug, { dispatch, queryFulfilled }) {
        const patchArticle = dispatch(
          apiSlice.util.updateQueryData('getArticle', slug, (draft) => {
            if (!draft.favorited) {
              draft.favorited = true;
              draft.favoritesCount++;
            }
          })
        );
        const pages = [1, 2, 3, 4, 5];
        const patchResultsList = pages.map((page) =>
          dispatch(
            apiSlice.util.updateQueryData('getArticles', page, (draft) => {
              const articleToUpdate = draft.articles.find(
                (a) => a.slug === slug
              );
              if (articleToUpdate && !articleToUpdate.favorited) {
                articleToUpdate.favorited = true;
                articleToUpdate.favoritesCount++;
              }
            })
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchArticle.undo();
          patchResultsList.forEach((patch) => patch.undo());
        }
      },
      invalidatesTags: (result, error, slug) => [
        { type: 'Articles', id: slug },
      ],
    }),
    unfavoriteArticle: builder.mutation({
      query: (slug) => ({
        url: `/articles/${slug}/favorite`,
        method: 'DELETE',
      }),
      async onQueryStarted(slug, { dispatch, queryFulfilled }) {
        const patchArticle = dispatch(
          apiSlice.util.updateQueryData('getArticle', slug, (draft) => {
            if (draft.favorited) {
              draft.favorited = false;
              draft.favoritesCount = Math.max(0, draft.favoritesCount - 1);
            }
          })
        );
        const pages = [1, 2, 3, 4, 5];
        const patchResultsList = pages.map((page) =>
          dispatch(
            apiSlice.util.updateQueryData('getArticles', page, (draft) => {
              const articleToUpdate = draft.articles.find(
                (a) => a.slug === slug
              );
              if (articleToUpdate && articleToUpdate.favorited) {
                articleToUpdate.favorited = false;
                articleToUpdate.favoritesCount = Math.max(
                  0,
                  articleToUpdate.favoritesCount - 1
                );
              }
            })
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchArticle.undo();
          patchResultsList.forEach((patch) => patch.undo());
        }
      },
      invalidatesTags: (result, error, slug) => [
        { type: 'Articles', id: slug },
      ],
    }),
    updateUser: builder.mutation({
      query: ({ username, email, bio, image }) => ({
        url: '/user',
        method: 'PUT',
        body: {
          user: { username, email, bio, image: image === '' ? null : image },
        },
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetArticlesQuery,
  useGetArticleQuery,
  useGetUserQuery,
  useRegisterUserMutation,
  useSignInUserMutation,
  useCreateArticleMutation,
  useEditArticleMutation,
  useDeleteArticleMutation,
  useFavoriteArticleMutation,
  useUnfavoriteArticleMutation,
  useUpdateUserMutation,
} = apiSlice;
