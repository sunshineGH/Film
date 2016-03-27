//杩欐槸涓�涓猰odel绫� 鐢ㄦ潵寰楀埌涓�涓暟鎹簱鐨勯摼鎺�
package com.db;

import java.sql.*;

public class ConnDB {
	
	private Connection ct = null;
	
	public Connection getConn(){
		
		try{
			//1.鍔犺浇椹卞姩
			Class.forName("com.mysql.jdbc.Driver").newInstance();
			//2.寰楀埌閾炬帴
			ct = DriverManager.getConnection("jdbc:mysql://10.103.241.137:3306/movie","root","root");
		}catch(Exception e){
			e.printStackTrace();
		}
		return ct;
	}

}
