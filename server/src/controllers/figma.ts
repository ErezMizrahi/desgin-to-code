import { FastifyReply, FastifyRequest } from "fastify";
import { getImagesType } from "../schemas/figma";
import figmaService from "../services/figma";

export const getImages = async (req: FastifyRequest<{ Body: getImagesType}>, reply: FastifyReply) => {
    const { apiKey, url } = req.body;
    const zip = await figmaService.getImages(apiKey, url);
    reply
        .header("Content-Type", "application/zip")
        .header("Content-Disposition", "attachment; filename=images.zip")
        .send(zip);
}