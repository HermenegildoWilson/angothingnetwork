function authenticateSensor(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: "Token ausente" });

    const token = auth.split(" ")[1];
    const sensor = findSensorByToken(token);

    if (!sensor) {
        return res.status(403).json({ error: "Sensor não autorizado" });
    }

    req.sensor = sensor;
    next();
}
