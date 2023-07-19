import Replicate from "replicate";

export default async function getImage(message) {
  try {
    const replicate = new Replicate({
      auth: "r8_5pBjMrQmcTv7fVNHBbvFd2MmIA9f6Fm0oN78o",
    });
    const model =
      "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf";
    const input = { prompt: message };
    const image_dimensions = "512x512";
    const output = await replicate.run(model, {
      input,
    });
    console.log(output);
    return {
      message: `Here is an image of ${message} return the image as markdown or html.`,
      image: output,
    };
  } catch (error) {
    console.log(error);
    return {
      message: `Sorry I couldn't fetch the image for ${message}`,
      image: "false",
    };
  }
}
