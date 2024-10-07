import { FastifyPluginAsync } from "fastify"
import { getImages } from "../../controllers/figma";
import { getImagesSchema } from "../../schemas/figma";

const figma: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post('/get-images',{ schema: getImagesSchema } , getImages);
}

export default figma;
