import { Type, Static } from '@sinclair/typebox'

const getImages = Type.Object({
    apiKey: Type.String(),
    url: Type.String()
});

export const getImagesSchema = {
    body: getImages
}

export type getImagesType = Static<typeof getImages>  