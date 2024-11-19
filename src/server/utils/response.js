class ResponseHandler {
  res200(message, data, res) {
    res.status(200).json({
      status: {
        code: 200,
        message,
      },
      data,
    });
  }

  res201(message, data, res) {
    res.status(201).json({
      status: {
        code: 201,
        message,
      },
      data,
    });
  }

  res400(msg, res) {
    res.status(400).json({
      status: {
        code: 400,
        message: "Bad Request! - " + msg,
      },
      data: null,
    });
  }

  res401(res) {
    res.status(401).json({
      status: {
        code: 401,
        message: "Unauthorized Access!",
      },
      data: null,
    });
  }

  res404(message, res) {
    res.status(404).json({
      status: {
        code: 404,
        message,
      },
      data: null,
    });
  }

  res500(res) {
    res.status(500).json({
      status: {
        code: 500,
        message: "Server error!",
      },
      data: null,
    });
  }
}

export default ResponseHandler;
