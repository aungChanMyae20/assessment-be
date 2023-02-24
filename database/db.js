const util = require( 'util' );
const mysql = require( 'mysql' );

const config = {
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'company'
}

module.exports = con;

function con() {
  const connection = mysql.createConnection( config );
  return {
    query( sql, args ) {
      return util.promisify( connection.query )
        .call( connection, sql, args );
    },
    close() {
      return util.promisify( connection.end ).call( connection );
    }
  };
}