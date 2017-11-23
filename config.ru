require "roda"

class HomeworkServer < Roda
  plugin :pass
  plugin :public
  plugin :status_handler
  plugin :header_matchers
  plugin :render, engine: 'slim'

  status_handler 404 do 
    response.status = 404
    view :error, locals: { message: "Sorry #{request.path} does not exist" }
  end

  route do |r|
    r.public

    r.on header: 'Origin' do |origin|
      response.headers["Access-Control-Allow-Origin"] = origin
      r.pass
    end

    r.root do 
      view :index
    end

    r.is 'style.css' do 
      render :style, engine: 'scss'
    end

    r.post do
      p r.body.read
      "{}"
    end
  end
end

run HomeworkServer.freeze.app