package com.serlvet;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.imageio.ImageIO;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.db.Category;
import com.db.Comment;
import com.db.Film;
import com.db.User;
import com.function.UserCl;
import com.jspsmart.upload.File;
import com.jspsmart.upload.Files;
import com.jspsmart.upload.SmartUpload;
import com.sun.corba.se.spi.orbutil.fsm.FSM;
import com.sun.swing.internal.plaf.metal.resources.metal_zh_TW;
import com.sun.xml.internal.ws.db.glassfish.BridgeWrapper;

import net.sf.json.JSONObject;

/**
 * Servlet implementation class InfoCl
 */
public class InfoCl extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
	static public String nullToString(String string){
		if(string == null){
			return "";
		}else{
			return string;
		}
	}
    public InfoCl() {
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
		String method = request.getParameter("method");
		if("login".equals(method)){  //表单中必须隐藏一个method='login'的列
			String id = request.getParameter("id");
			String password = nullToString(request.getParameter("password"));
			String isadmin = nullToString(request.getParameter("isadmin"));
			int result = new UserCl().login(id, password, isadmin);
			if(result == 1){  //正确登录  应该跳入后台页面
				HttpSession session = request.getSession();
				session.setAttribute("id", id);
				session.setAttribute("password", password);
				session.setAttribute("isadmin", isadmin);
				response.sendRedirect("pages/manager/index.html#/?id="+id);
			}else{
				response.sendRedirect("pages/manager/login.html?error="+result);
			}
		}
		if("getUser".equals(method)){
			String id = request.getParameter("id");
			User result = new UserCl().getUser(id);
			JSONObject obj = new JSONObject() ;
			obj.put("result", result);
			response.getWriter().write(obj.toString());
		}
		if("deleteFilm".equals(method)){
			String id = nullToString(request.getParameter("id"));
			boolean result = new UserCl().deleteFilm(id);
			JSONObject obj = new JSONObject() ;
			obj.put("result", result);
			response.getWriter().write(obj.toString());
		}
		
		if("updateFilm".equals(method)){
			String id = nullToString(request.getParameter("id"));
			String name = nullToString(request.getParameter("name"));
			name = new String(name.getBytes("ISO8859-1"),"UTF-8");
			String hot = nullToString(request.getParameter("hot"));
			String time = nullToString(request.getParameter("time"));
			String director = nullToString(request.getParameter("director"));
			director = new String(director.getBytes("ISO8859-1"), "UTF-8");
			String introduction = nullToString(request.getParameter("introduction"));
			introduction = new String(introduction.getBytes("ISO8859-1"), "UTF-8");
			String price = nullToString(request.getParameter("price"));
			String[] category = request.getParameterValues("category");
			
			String str_category = "";
			if(category != null){
				for(int i = 0 ; i < category.length; i++){
					//category[i] = new String(category[i].getBytes("ISO8859-1"),"UTF-8");
					if(!"".equals(category[i])){
						str_category += category[i] + ",";
					}
				}
				str_category = str_category.substring(0, str_category.length() - 1);
			}
			str_category = new String(str_category.getBytes("ISO8859-1"), "UTF-8");
			boolean result = new UserCl().updateFilm(id, name, hot, time, director, introduction, price, str_category);
			JSONObject obj = new JSONObject() ;
			obj.put("result", result);
			response.getWriter().write(obj.toString());
		}
		if("getFilmList".equals(method)){
			String name = nullToString(request.getParameter("name"));
			String category = nullToString(request.getParameter("category"));
			String currentpage = nullToString(request.getParameter("currentpage"));
			name = new String(name.getBytes("ISO8859-1"),"UTF-8");
			if("".equals(currentpage)){
				currentpage = "1";
			}
			int current = Integer.parseInt(currentpage);
			Map<String, Object> result = new UserCl().getFilmList(name, category, current);
			JSONObject obj = new JSONObject() ;
			obj.put("result", result);
			response.getWriter().write(obj.toString());
		}
		
		if("getCommentList".equals(method)){
			String filmid = nullToString(request.getParameter("filmid"));
			String currentpage = nullToString(request.getParameter("currentpage"));
			if("".equals(currentpage)){
				currentpage = "1";
			}
			int current = Integer.parseInt(currentpage);
			Map<String, Object> result = new UserCl().getCommentList(filmid,current);
			JSONObject obj = new JSONObject() ;
			obj.put("result", result);
			response.getWriter().write(obj.toString());
		}
		
		if("getCommentById".equals(method)){
			String id = nullToString(request.getParameter("id"));
			Comment result = new UserCl().getCommentById(id);
			JSONObject obj = new JSONObject() ;
			obj.put("result", result);
			response.getWriter().write(obj.toString());
		}
		
		if("deleteComment".equals(method)){
			String id = nullToString(request.getParameter("id"));
			String filmid = nullToString(request.getParameter("filmid"));
			String grade = nullToString(request.getParameter("grade"));
			boolean result = new UserCl().deleteComment(id,filmid,grade);
			JSONObject obj = new JSONObject() ;
			obj.put("result", result);
			response.getWriter().write(obj.toString());
		}
		
		if("addComment".equals(method)){
			String comment = nullToString(request.getParameter("comment"));
			String filmid = nullToString(request.getParameter("filmid"));
			String userid = nullToString(request.getParameter("userid"));
			String grade = nullToString(request.getParameter("grade"));
			if(!"".equals(comment)){
				comment = new String(comment.getBytes("ISO8859-1"),"UTF-8");
			}
			boolean result = new UserCl().addComment(comment, filmid, userid, grade);
			JSONObject obj = new JSONObject() ;
			obj.put("result", result);
			response.getWriter().write(obj.toString());
		}
		
		if("addUser".equals(method)){
			String id = request.getParameter("id");
			String password = request.getParameter("password");
			String sex = request.getParameter("sex");
			String name = request.getParameter("name");
			String isadmin = request.getParameter("isadmin");
			String phone = request.getParameter("phone");
			if(name == null){
				name = "";
			}
			if(sex == null){
				sex = "男";
			}
			name = new String(name.getBytes("ISO8859-1"),"UTF-8");
			sex = new String(sex.getBytes("ISO8859-1"),"UTF-8");
			boolean result = new UserCl().addUser(id, name, password, phone, isadmin, sex);
			JSONObject obj = new JSONObject() ;
			obj.put("result", result);
			response.getWriter().write(obj.toString());
		}
		
		if("isSaveUser".equals(method)){
			String id = nullToString(request.getParameter("id"));
			boolean result = new UserCl().isSaveUser(id);
			JSONObject obj = new JSONObject() ;
			obj.put("result", result);
			response.getWriter().write(obj.toString());
		}
		
		if("addFilm".equals(method)){
			//String name = nullToString(request.getParameter("name"));
			//name = new String(name.getBytes("ISO8859-1"),"UTF-8");
			ServletConfig config = this.getServletConfig();
			SmartUpload smartUpload = new SmartUpload();
			smartUpload.initialize(config, request, response);
			try {
				smartUpload.upload();
				File f1 = smartUpload.getFiles().getFile(0);
				String imageName = f1.getFieldName();
				int idx = imageName.lastIndexOf(".");
				String imageType = imageName.substring(idx, imageName.length());
				String newImageName = String.valueOf(System.currentTimeMillis());
				String path = request.getSession().getServletContext().getRealPath("/pics/");
				String imagePath = path + java.io.File.separator + newImageName + imageType;
				f1.saveAs(imagePath);
			} catch (Exception e) {
				// TODO: handle exception
				e.printStackTrace();
			}
			/*String fileName = System.currentTimeMillis() + ".jpg";
			String basePath = request.getSession().getServletContext().getRealPath("/pics/");
			String filePath = basePath;
			String realFilePath = filePath + "\\" + fileName;
			BufferedImage bufferedImage = ImageIO.read(request.getInputStream());
			if(bufferedImage != null){
				ImageIO.write(bufferedImage, "jpg", new java.io.File(filePath,fileName));
			}*/
			/*SmartUpload upload = new SmartUpload();
			upload.initialize(this.getServletConfig(), request, response);
			try {
				upload.upload();
			} catch (Exception e) {
				// TODO: handle exception
				e.printStackTrace();
			}
			long f1 = (new java.util.Date()).getTime();
			Files files = upload.getFiles();
			File file = files.getFile(0);
			String picurl = "/pics/" + f1 + ".jpg";
			try {
				file.saveAs(picurl,file.SAVEAS_AUTO);
			} catch (Exception e) {
				// TODO: handle exception
				e.printStackTrace();
			}*/
		}
		if("updateUser".equals(method)){
			String id = nullToString(request.getParameter("id"));
			String password = nullToString(request.getParameter("password"));
			String sex = nullToString(request.getParameter("sex"));
			String phone = nullToString(request.getParameter("phone"));
			String name = nullToString(request.getParameter("name"));
			String isreward = nullToString(request.getParameter("isreward"));
			String money = nullToString(request.getParameter("money"));
			if(!"".equals(name)){
				name = new String(name.getBytes("ISO8859-1"),"UTF-8");
			}
			if(!"".equals(sex)){
				sex = new String(sex.getBytes("ISO8859-1"),"UTF-8");
			}
			boolean result = new UserCl().updateUser(id, sex, password, phone, isreward, money,name);
			JSONObject obj = new JSONObject() ;
			obj.put("result", result);
			response.getWriter().write(obj.toString());
		}
		if("deleteUser".equals(method)){
			String id = nullToString(request.getParameter("id"));
			boolean result = new UserCl().deleteUser(id);
			JSONObject obj = new JSONObject() ;
			obj.put("result", result);
			response.getWriter().write(obj.toString());
		}
		if("getUserList".equals(method)){
			String currentPage = nullToString(request.getParameter("currentpage"));
			String name = nullToString(request.getParameter("name"));
			String isadmin = nullToString(request.getParameter("isadmin"));
			if("".equals(isadmin)){
				isadmin = "0";
			}
			name = new String(name.getBytes("ISO8859-1"),"UTF-8");
			int current;
			if(currentPage == ""){
				current = 1;
			}else{
				current = Integer.parseInt(currentPage);
			}
			Map<String, Object> result = new UserCl().getUserList(current, name, isadmin);
			JSONObject obj = new JSONObject() ;
			obj.put("result", result);
			response.getWriter().write(obj.toString());
		}
		if("getCategoryList".equals(method)){
			List<Category> result = new UserCl().getCategory();
			JSONObject obj = new JSONObject() ;
			obj.put("result", result);
			response.getWriter().write(obj.toString());
		}
		if("addCategory".equals(method)){
			String name = nullToString(request.getParameter("name"));
			String introduction = nullToString(request.getParameter("introduction"));
			name = new String(name.getBytes("ISO8859-1"),"UTF-8");
			introduction = new String(introduction.getBytes("ISO8859-1"),"UTF-8");
			boolean result = new UserCl().addCategory(name,introduction);
			JSONObject obj = new JSONObject() ;
			obj.put("result", result);
			response.getWriter().write(obj.toString());
		}
		if("deleteCategory".equals(method)){
			String id = nullToString(request.getParameter("id"));
			boolean result = new UserCl().deleteCategory(id);
			JSONObject obj = new JSONObject() ;
			obj.put("result", result);
			response.getWriter().write(obj.toString());
		}
		if("getFilm".equals(method)){
			String id = nullToString(request.getParameter("id"));
			Film result = new UserCl().getFilm(id);
			JSONObject obj = new JSONObject() ;
			obj.put("result", result);
			response.getWriter().write(obj.toString());
		}
		if("addReply".equals(method)){
			String commentid = nullToString(request.getParameter("commentid"));
			String reply_userid = nullToString(request.getParameter("userid"));
			String reply = nullToString(request.getParameter("reply"));
			reply = new String(reply.getBytes("ISO8859-1"),"UTF-8");
			boolean result = new UserCl().addReply(commentid, reply_userid, reply);
			JSONObject obj = new JSONObject() ;
			obj.put("result", result);
			response.getWriter().write(obj.toString());
		}
		if("deleteReply".equals(method)){
			String id = nullToString(request.getParameter("id"));
			boolean result = new UserCl().deleteReply(id);
			JSONObject obj = new JSONObject() ;
			obj.put("result", result);
			response.getWriter().write(obj.toString());
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
