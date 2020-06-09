class Api::DrawroomController < Api::ApplicationController
  def index
    # Canvases = Canvas.all
    #    render json: canvases
  end

  def sync
    puts params["points"]
    ActionCable.server.broadcast 'canvas_channel', params["points"]

  end
end
