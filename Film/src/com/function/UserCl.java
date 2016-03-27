package com.function;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;


import com.db.Category;
import com.db.Comment;
import com.db.ConnDB;
import com.db.Film;
import com.db.User;
import com.sun.jndi.toolkit.ctx.StringHeadTail;


public class UserCl {
	Connection ct = null;
	PreparedStatement ps = null;
	ResultSet rs = null;
	
	public int login(String id , String password, String isadmin){  //0是查无此人 1是正确 2是密码错误
		int result = 0;
		try {
			ct = new ConnDB().getConn();
			ps = ct.prepareStatement("select password , isadmin from user where id=?");
			ps.setString(1, id);
			rs = ps.executeQuery();
			if(rs.next()){
				String password_db = rs.getString(1);
				String isadmin_db = rs.getString(2);
				if(password.equals(password_db) && isadmin.equals(isadmin_db)){
					result = 1;
				}else{
					result = 2;
				}
			}
			return result;
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		} finally {
			this.destory();
		}
		return result;
	}
	
	public boolean isSaveUser(String id) {
		boolean result = true;
		try {
			ct = new ConnDB().getConn();
			ps = ct.prepareStatement("select * from user where id='" + id + "'");
			rs = ps.executeQuery();
			if(rs.next()){
				result = false;
			}
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		} finally {
			this.destory();
		}
		return result;
	}
	
	public Comment getCommentById(String id) {
		Comment temp = new Comment();
		try {
			ct = new ConnDB().getConn();
			String sql = "select distinct comment.*, user.name from comment join user "
					   + " on comment.userid = user.id "
					   + " where comment.isdelete = 0 and comment.id ='" + id + "'";	
			ps = ct.prepareStatement(sql);
			rs = ps.executeQuery();
			if(rs.next()){
				temp.setId(rs.getInt(1));
				temp.setComment(rs.getString(2));
				temp.setFilmid(rs.getInt(3));
				temp.setUserid(rs.getString(4));
				temp.setGrade(rs.getInt(5));
				temp.setTime(rs.getString(7));
				temp.setIsdelete(rs.getString(6));
				temp.setGoodcount(rs.getInt(8));
				temp.setUsername(rs.getString(9));
			}
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		} finally {
			this.destory();
		}
		return temp;
	}
	
	public Map<String, Object> getFilmList(String name,String category,int current){
		Map<String, Object> map = new HashMap<>();
		List<Film> result = new LinkedList<>();
		Map<String, String> category_map = new HashMap<String, String>();
		try {
			ct = new ConnDB().getConn();
			int count = 0;
			ps = ct.prepareStatement("select * from category");
			rs = ps.executeQuery();
			while (rs.next()) {
				String _id = rs.getString(1);
				String _name = rs.getString(2);
				category_map.put(_id, _name);
			}
			String sql = "select * from film where 1 = 1 ";
			String sql_count = "select count(*) from film where 1 = 1 ";
			if(!"".equals(name)){
				sql += " and name like '%" + name +"%' ";
				sql_count += " and name like '%" + name +"%' ";
			}
			if(!"".equals(category)){
				sql += " and FIND_IN_SET('" + category + "',category) ";
				sql_count += " and FIND_IN_SET('" + category + "',category) ";
			}
			sql += " order by gradecount ";
			sql += " limit " + (current - 1) * 10 +", " + current * 10;
			ps = ct.prepareStatement(sql_count);
			rs = ps.executeQuery();
			if(rs.next()){
				count = rs.getInt(1);
			}
			ps = ct.prepareStatement(sql);
			rs = ps.executeQuery();
			while (rs.next()) {
				Film temp = new Film();
				temp.setId(rs.getInt(1));
				temp.setName(rs.getString(2));
				temp.setHot(rs.getString(3));
				temp.setComment(rs.getInt(4));
				temp.setTime(rs.getString(5));
				temp.setDirector(rs.getString(6));
				temp.setIntroduction(rs.getString(7));
				temp.setPrice(rs.getString(8));
				temp.setPicture(rs.getString(9));
				String _category = rs.getString(10);
				String[] arr_category = _category.split(",");
				String str_category = "";
				for(String string : arr_category){
					if(category_map.get(string) != null){
						str_category += category_map.get(string) + ",";
					}
				}
				if(str_category.length() > 1){
					str_category.substring(0,str_category.length() - 1);
				}
				temp.setCategory(str_category);
				temp.setGradecount(rs.getInt(11));
				result.add(temp);
			}
			map.put("count", count);
			map.put("films", result);
			return map;
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		} finally {
			this.destory();
		}
		return map;
	}
	
	public boolean deleteReply(String id){
		boolean result = false;
		
		try {
			ct = new ConnDB().getConn();
			ps = ct.prepareStatement("delete from reply where id='" + id + "'");
			
			if(ps.executeUpdate() > 0){
				result = true;
			}
			return result;
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		} finally {
			this.destory();
		}
		return result;
	}
	
	public boolean addFilm(String name,String hot,String time,String director,String introduction,
			String price,String picture,String[] category){
		boolean result = false;
		Map<String, String> category_map = new HashMap<String, String>();
		try {
			ct = new ConnDB().getConn();
			ps = ct.prepareStatement("select * from category");
			rs = ps.executeQuery();
			while (rs.next()) {
				String _id = rs.getString(1);
				String _name = rs.getString(2);
				category_map.put(_name, _id);
			}
			ps = ct.prepareStatement("select * from film where name='" + name + "'");
			rs = ps.executeQuery();
			if(rs.next()){
				return false;
			}
			String db_category = "";
			if(category.length > 0){
				for(String str : category){
					db_category = db_category + category_map.get(str) + ",";
				}
				db_category = db_category.substring(0, db_category.length() - 1);
			}
			ps = ct.prepareStatement("insert into film(name,hot,time,director,introduction,price"
					+ ",picture,category) values(?,?,?,?,?,?,?,?)");
			ps.setString(1, name);
			ps.setString(2, hot);
			ps.setString(3, time);
			ps.setString(4, director);
			ps.setString(5, introduction);
			ps.setString(6, price);
			ps.setString(7, picture);
			ps.setString(8, db_category);
			if(ps.executeUpdate() > 0){
				result = true;
			}
			return result;
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		} finally {
			this.destory();
		}
		return result;
	}
	
	public boolean addReply(String commentid,String reply_userid,String reply) {
		boolean result = false;
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String time = format.format(new Date());
		try {
			ct = new ConnDB().getConn();
			String sql = "insert into reply(commentid,reply_userid,reply,time) values(?,?,?,?)";
			ps = ct.prepareStatement(sql);
			ps.setString(1, commentid);
			ps.setString(2, reply_userid);
			ps.setString(3, reply);
			ps.setString(4, time);
			if(ps.executeUpdate() > 0){
				result = true;
			}
			return result;
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		} finally {
			this.destory();
		}
		return result;
	}
	
	public boolean updateFilm(String id,String name,String hot,String time,String director,String introduction,String price,String category) {
		boolean result = false;
		Map<String, String> category_map = new HashMap<String, String>();
		String db_category = "";
		try {
			ct = new ConnDB().getConn();
			ps = ct.prepareStatement("select * from category");
			rs = ps.executeQuery();
			while (rs.next()) {
				String _id = rs.getString(1);
				String _name = rs.getString(2);
				category_map.put(_name, _id);
			}
			for(String str : category.split(",")){
				db_category += category_map.get(str) + ",";
			}
			if(db_category.length() > 0){
				db_category = db_category.substring(0, db_category.length() - 1);
			}
			String sql = "update film set id='" + id + "'";
			if(!"".equals(name)){
				sql += ",name='" + name + "'";
			}
			if(!"".equals(hot)){
				sql += ",hot='" + hot + "'";
			}
			if(!"".equals(time)){
				sql += ",time='" + time + "'";
			}
			if(!"".equals(director)){
				sql += ",director='" + director + "'";
			}
			if(!"".equals(introduction)){
				sql += ",introduction='" + introduction + "'";
			}
			if(!"".equals(price)){
				sql += ",price='" + price + "'";
			}
			if(!"".equals(category)){
				sql += ",category='" + db_category + "'";
			}
			sql += " where id='" + id + "'";
			ps = ct.prepareStatement(sql);
			if(ps.executeUpdate() > 0){
				result = true;
			}
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		} finally {
			this.destory();
		}
		return result;
	}
	
	public boolean deleteFilm(String id) {
		boolean result = false;
		try {
			ct = new ConnDB().getConn();
			ps = ct.prepareStatement("delete from film where id='" + id +"'");
			if(ps.executeUpdate() > 0){
				result = true;
			}
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		} finally{
			this.destory();
		}
		return result;
	}
	
	public boolean addComment(String comment,String filmid,String userid,String grade){
		boolean result = false;
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String time = format.format(new Date());
		try {
			ct = new ConnDB().getConn();
			ps = ct.prepareStatement("insert into comment(comment,filmid,userid,grade,time) values(?,?,?,?,?)");
			ps.setString(1, comment);
			ps.setString(2, filmid);
			ps.setString(3, userid);
			ps.setString(4, grade);
			ps.setString(5, time);
			if(ps.executeUpdate() > 0){
				result = true;
			}
			ps = ct.prepareStatement("update film set comment = comment + 1 and gradecount = gradecount + grade where id ='" + filmid + "'");
			ps.executeUpdate();
			ps = ct.prepareStatement("select count(*),user.isreward from comment join user on user.id=comment.userid where comment.userid='" + userid +"'");
			rs = ps.executeQuery();
			if(rs.next()){
				int count = rs.getInt(1);
				String isreward = rs.getString(2);
				if(count % 5 == 0 && "0".equals(isreward)){
					ps = ct.prepareStatement("update user set isreward = 1 where id='"+userid +"'");
					ps.executeUpdate();
				}
			}
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		} finally {
			this.destory();
		}
		return result;
	}
	
	public Map<String, Object> getCommentList(String filmid,int current) {
		Map<String, Object> result = new HashMap<>();
		List<Comment> list = new LinkedList<>();
		try {
			int count = 0;
			ct = new ConnDB().getConn();
			String sql_count = "select distinct count(*) from comment join user "
					         + " on comment.userid = user.id and comment.filmid = '" + filmid + "'"
					         + " where comment.isdelete = 0";
			String sql = "select distinct comment.*, user.name from comment join user "
					   + " on comment.userid = user.id and comment.filmid = '" + filmid + "'"
					   + " where comment.isdelete = 0"
					   + " order by comment.time desc"
					   + " limit " + (current - 1) * 10 +", " + current * 10;
			ps = ct.prepareStatement(sql_count);
			rs = ps.executeQuery();
			if(rs.next()){
				count  = rs.getInt(1);
			}
			ps = ct.prepareStatement(sql);
			rs = ps.executeQuery();
			while (rs.next()) {
				Comment temp = new Comment();
				temp.setId(rs.getInt(1));
				temp.setComment(rs.getString(2));
				temp.setFilmid(rs.getInt(3));
				temp.setUserid(rs.getString(4));
				temp.setGrade(rs.getInt(5));
				temp.setTime(rs.getString(7));
				temp.setIsdelete(rs.getString(6));
				temp.setGoodcount(rs.getInt(8));
				temp.setUsername(rs.getString(9));
				list.add(temp);
			}
			result.put("count", count);
			result.put("comments", list);
			return result;
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		} finally {
			this.destory();
		}
		return result;
	}
	
	public boolean deleteComment(String id,String filmid,String grade) {
		boolean result = false;
		try {
			ct = new ConnDB().getConn();
			String sql = "update comment set isdelete = 1 where id='" + id + "'";
			ps = ct.prepareStatement(sql);
			if(ps.executeUpdate() > 0){
				result = true;
			}
			ps = ct.prepareStatement("update film set comment = comment - 1 and gradecount = gradecount - grade where id='" + filmid +"'");
			ps.executeUpdate();
			ps = ct.prepareStatement("delete from reply where commentid = '" + id + "'");
			ps.executeUpdate();
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		} finally {
			this.destory();
		}
		return result;
	}
	
	public Film getFilm(String id){
		Film result = new Film();
		Map<String, String> category = new HashMap<String, String>();
		try {
			ct = new ConnDB().getConn();
			ps = ct.prepareStatement("select * from category");
			rs = ps.executeQuery();
			while (rs.next()) {
				String _id = rs.getString(1);
				String _name = rs.getString(2);
				category.put(_id, _name);
			}
			ps = ct.prepareStatement("select * from film where id='" + id + "'");
			rs = ps.executeQuery();
			if(rs.next()){
				result.setId(Integer.parseInt(id));
				result.setName(rs.getString(2));
				result.setHot(rs.getString(3));
				result.setComment(rs.getInt(4));
				result.setTime(rs.getString(5));
				result.setDirector(rs.getString(6));
				result.setIntroduction(rs.getString(7));
				result.setPrice(rs.getString(8));
				result.setPicture(rs.getString(9));
				String _category = rs.getString(10);
				String[] arr_category = _category.split(",");
				String str_category = "";
				for(String string : arr_category){
					if(category.get(string) != null){
						str_category += category.get(string) + ",";
					}
				}
				str_category.substring(0,str_category.length() - 1);
				result.setCategory(str_category);
				result.setGradecount(rs.getInt(11));
			}
			return result;
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		} finally {
			this.destory();
		}
		return result;
	}
	
	public Map<String, Object> getUserList(int current,String name,String isadmin){
		Map<String, Object> result = new HashMap<>();
		List<User> list = new LinkedList<>();
		int count = 0;
		try {
			ct = new ConnDB().getConn();
			String countsql = "select count(*) from user where isadmin='" + isadmin + "'";
			String sql = "select * from user where isadmin='" + isadmin + "'";
			if(!"".equals(name)){
				countsql += "and name like '%" + name + "%' ";
				sql += "and name like '%" + name + "%' ";
			}
			sql +=" limit " + (current - 1) * 10 +", " + current * 10;
			ps = ct.prepareStatement(countsql);
			rs = ps.executeQuery();
			if(rs.next()){
				count = rs.getInt(1);
			}
			ps = ct.prepareStatement(sql);
			rs = ps.executeQuery();
			while (rs.next()) {
				User temp = new User();
				temp.setId(rs.getString(1));
				temp.setName(rs.getString(2));
				temp.setPassword(rs.getString(3));
				temp.setSex(rs.getString(4));
				temp.setPhone(rs.getString(5));
				temp.setMoney(rs.getString(6));
				temp.setIsadmin(rs.getString(7));
				temp.setIsreward(rs.getString(8));
				list.add(temp);
			}
			result.put("count", count);
			result.put("users", list);
			return result;
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		} finally {
			this.destory();
		}
		return result;
	}
	
	public boolean deleteCategory(String id){
		boolean result = false;
		try {
			ct = new ConnDB().getConn();
			ps = ct.prepareStatement("delete from category where id='" + id + "'");
			if(ps.executeUpdate() > 0){
				result = true;
			}
			return result;
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		} finally {
			this.destory();
		}
		return result;
	}
	
	
	public boolean addCategory(String name,String introduction){  //true成功   false已存在
		boolean result = false;
		List<Category> list = getCategory();
		Map<String,Integer> map = new HashMap<>();
		for(Category category : list){
			map.put(category.getName(), category.getId());
		}
		if(map.get(name) != null){
			result = false;
			return result;
		}else{
			try {
				ct = new ConnDB().getConn();
				ps = ct.prepareStatement("insert into category(name,introduction) value(?,?)");
				ps.setString(1, name);
				ps.setString(2, introduction);
				if(ps.executeUpdate() > 0){
					result = true;
				}
				return result;
			} catch (Exception e) {
				// TODO: handle exception
				e.printStackTrace();
			} finally {
				this.destory();
			}
		}
		return result;
	}
	
	public List<Category> getCategory(){
		List<Category> result = new LinkedList<Category>();
		try {
			ct = new ConnDB().getConn();
			ps = ct.prepareStatement("select * from category");
			rs = ps.executeQuery();
			while (rs.next()) {
				Category temp = new Category();
				temp.setId(rs.getInt(1));
				temp.setName(rs.getString(2));
				temp.setIntroduction(rs.getString(3));
				result.add(temp);
			}
			return result;
		} catch (Exception e) {
			e.printStackTrace();
			// TODO: handle exception
		} finally {
			this.destory();
		}
		return result;
	}
	
	public boolean addUser(String id,String name,String password,String phone,String isadmin,String sex){
		boolean result = false;
		try {
			ct = new ConnDB().getConn();
			ps = ct.prepareStatement("INSERT into user(id,name,password,sex,phone,isadmin) VALUES(?,?,?,?,?,?)");
			ps.setString(1,id );
			ps.setString(2, name);
			ps.setString(3, password);
			ps.setString(4, sex);
			ps.setString(5, phone);
			ps.setString(6, isadmin);
			if(ps.executeUpdate() > 0){
				result = true;
			}
			return result;
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		} finally {
			this.destory();
		}
		return result;
	}
	
	public User getUser(String id){
		User result = new User();
		try {
			ct = new ConnDB().getConn();
			ps = ct.prepareStatement("select * from user where id = ?");
			ps.setString(1, id);
			rs = ps.executeQuery();
			if(rs.next()){
				String name = rs.getString(2);
				String password = rs.getString(3);
				String sex = rs.getString(4);
				String phone = rs.getString(5);
				String money = rs.getString(6);
				String isadmin = rs.getString(7);
				String isreward = rs.getString(8);
				result.setId(id);
				result.setName(name);
				result.setPassword(password);
				result.setSex(sex);
				result.setPhone(phone);
				result.setMoney(money);
				result.setIsadmin(isadmin);
				result.setIsreward(isreward);
			}
			return result;
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		} finally {
			this.destory();
		}
		return result;
	}
	
	public boolean updateUser(String id,String sex,String password,String phone,String isreward,String money,String name){
		boolean result = false;
		try {
			ct = new ConnDB().getConn();
			String sql = "update user set id='" + id +"'";
			if(!"".equals(sex)){
				sql += " , sex='" + sex +"'";
			}
			if(!"".equals(password)){
				sql += " , password='" + password + "'";
			}
			if(!"".equals(phone)){
				sql += " , phone='" + phone + "'";
			}
			if(!"".equals(isreward)){
				sql += " , isreward='" + isreward +"'";
			}
			if(!"".equals(money)){
				sql += " , money='" + money +"'";
			}
			if(!"".equals(name)){
				sql += " , name='" + name + "'";
			}
			sql += " where id='" + id + "'";
			ps = ct.prepareStatement(sql);
			if(ps.executeUpdate() > 0){
				result = true;
			}
			return result;
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		} finally {
			this.destory();
		}
		return result;
	}
	
	public boolean deleteUser(String id){
		boolean result = false;
		try {
			ct = new ConnDB().getConn();
			ps = ct.prepareStatement("delete from user where id='" + id +"'");
			if(ps.executeUpdate() > 0){
				result = true;
				ps = ct.prepareStatement("update comment set isdelete = 1 where userid ='" + id + "'");
				ps.executeUpdate();
				ps = ct.prepareStatement("delete from reply where reply_userid = '" + id + "'");
				ps.executeUpdate();
			}
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		} finally {
			this.destory();
		}
		return result;
	}
	
	public void destory(){
		try {
			if(rs != null){
				rs.close();
				rs = null;
			}
			if(ps != null){
				ps.close();
				ps = null;
			}
			if(ct != null){
				ct.close();
				ct = null;
			}
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}
		
	}
}
