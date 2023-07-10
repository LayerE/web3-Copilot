export default function (data, res) {
    res.write(`data: ${JSON.stringify({ data })}\n\n`);
}
