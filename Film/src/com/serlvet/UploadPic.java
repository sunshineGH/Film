package com.serlvet;

import java.io.IOException;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.function.UserCl;
import com.jspsmart.upload.File;
import com.jspsmart.upload.Request;
import com.jspsmart.upload.SmartUpload;
import com.sun.corba.se.spi.orb.StringPair;

import net.sf.json.JSONObject;

/**
 * Servlet implementation class UploadPic
 */
public class UploadPic extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public UploadPic() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		//response.getWriter().append("Served at: ").append(request.getContextPath());
		response.setContentType("text/html;charset=UTF-8");
		response.addHeader("Access-Control-Allow-Origin", "*");
		response.addHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
		response.addHeader("Access-Control-Allow-Headers","Content-Type, Authorization, Accept,X-Requested-With");
		ServletConfig config = this.getServletConfig();
		SmartUpload smartUpload = new SmartUpload();
		smartUpload.initialize(config, request, response);
		try {
			
			smartUpload.upload();
			
			Request request2 = smartUpload.getRequest();
			String name = request2.getParameter("name");
			String hot = request2.getParameter("hot");
			String time = request2.getParameter("time");
			String director = request2.getParameter("director");
			String price = request2.getParameter("price");
			String introduction = request2.getParameter("introduction");
			//String[] category = request2.getParameterValues("category");
			String categorycount = request2.getParameter("categorycount");
			if("".equals(categorycount)){
				categorycount = "0";
			}
			String[] category = new String[Integer.parseInt(categorycount)];
			for(int i = 0 ; i < Integer.parseInt(categorycount); i++){
				 category[i]= request2.getParameter("category["+i+"]");
				
			}
			File f1 = smartUpload.getFiles().getFile(0);
			String imageName = f1.getFileName();
			int idx = imageName.lastIndexOf(".");
			String imageType = imageName.substring(idx, imageName.length());
			String newImageName = String.valueOf(System.currentTimeMillis());
			//String path = "E:" + java.io.File.separator + "FilmPic";
			/*java.io.File file = new java.io.File(path);
			if(!file.exists()){
				file.mkdirs();
			}*/
			String db_url = "pics/" + newImageName + imageType;
			String path = request.getRealPath("/") + "pics" + java.io.File.separator + newImageName + imageType;
			//System.out.println(path);
			//String imagePath = path + java.io.File.separator + newImageName + imageType;
			f1.saveAs(path,f1.SAVEAS_AUTO);
			boolean result = new UserCl().addFilm(name, hot, time, director, introduction, price, db_url, category);
			JSONObject obj = new JSONObject() ;
			obj.put("result", result);
			response.getWriter().write(obj.toString());
			
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
