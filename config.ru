require "roda"

class HomeworkServer < Roda
  plugin :type_routing
  plugin :static, ['/']
  plugin :status_handler
  plugin :render, engine: 'slim'

  status_handler 404 do 
    response.status = 404
    view :error, locals: { message: "Sorry #{request.path} does not exist" }
  end

  route do |r|
    r.root do 
      view :index
    end

    r.is 'style.css' do 
      render :style, engine: 'scss'
    end

    r.get '/' do
      r.public
    end
  end
end

run HomeworkServer.freeze.app