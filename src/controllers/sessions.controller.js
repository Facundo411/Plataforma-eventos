export function sessions(req, res) {
    res.status(200).json({
        status: "success",
        message: "Sessions endpoint"
    });
}