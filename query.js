const oracledb = require('oracledb');
const dbConfig = require('./config')

async function query1() {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const sql = 
    `
    SELECT 
    year,(floor(AVG(age)) - floor(STDDEV(age) * 1.25)) as "-1.25σ",(floor(AVG(age)) - floor(STDDEV(age))) as "-1σ",
    floor(AVG(age)) as "mean",(floor(AVG(age)) + floor(STDDEV(age))) as "1σ",(floor(AVG(age)) + floor(STDDEV(age) * 1.25)) as "1.25σ",
    ROUND(((1 / (STDDEV(age) * SQRT(2 * 3.14159))) * POWER(2.718281, -POWER((floor(AVG(age)) - floor(STDDEV(age) * 1.25)) - AVG(age), 2) / POWER((2 * STDDEV(age)), 2))) - 0.0005, 3
    ) as "y1",ROUND(((1 / (STDDEV(age) * SQRT(2 * 3.14159))) * POWER(2.718281, -POWER((floor(AVG(age)) - floor(STDDEV(age) * 1)) - AVG(age), 2) / POWER((2 * STDDEV(age)), 2))) - 0.0005, 3
    ) as "y2",ROUND((1 / (STDDEV(age) * SQRT(2 * 3.14159))) * POWER(2.718281, -POWER((floor(AVG(age))) - AVG(age), 2) / POWER((2 * STDDEV(age)), 2)), 3
    ) as "y3",ROUND(((1 / (STDDEV(age) * SQRT(2 * 3.14159))) * POWER(2.718281, -POWER((floor(AVG(age)) + floor(STDDEV(age) * 1)) - AVG(age), 2) / POWER((2 * STDDEV(age)), 2))) - 0.0005, 3
    ) as "y4",ROUND(((1 / (STDDEV(age) * SQRT(2 * 3.14159))) * POWER(2.718281, -POWER((floor(AVG(age)) + floor(STDDEV(age) * 1.25)) - AVG(age), 2) / POWER((2 * STDDEV(age)), 2))) - 0.0005, 3
    ) as "y5" FROM 
    victim
    JOIN 
    crime ON victim.crimeid = crime.crimeid 
    GROUP BY 
    year
    ORDER BY 
    year asc
    `;
    const result = await connection.execute(sql);
    return result;
  } catch (error) {
    console.error('Error in query 1:', error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error('Error closing database connection:', error);
      }
    }
  }
}

async function query2() {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const sql = 
    `SELECT A.Year, Unemployment, round(THEFT*100/TotalCrime,2) AS Theft, round(ASLT*100/TotalCrime,2) AS Assault, round(KDNP*100/TotalCrime,2) AS Kidnapping, round(HOM*100/TotalCrime,2) AS Homicide, round(ROB*100/TotalCrime,2) AS Robbery, round(BURG*100/TotalCrime,2) AS Burglary
    FROM (select CrmYear as Year, THEFT,ASLT,KDNP,HOM,ROB,BURG,Unemployment from 
    (select year CrmYear, count(*) TOTAL from jgoldstein3.crime group by crime.year),
    (select year TheftYear, count(*) THEFT from jgoldstein3.crime where crime.crimetype like '%THEFT%' group by year),
    (select year AsltYear, count(*) ASLT from jgoldstein3.crime where crime.crimetype like '%ASSAULT%' group by year),
    (select year KdnpYear, count(*) KDNP from jgoldstein3.crime where crime.crimetype like '%KIDNAPPING%' group by year),
    (select year HomYear, count(*) HOM from jgoldstein3.crime where crime.crimetype like '%HOMICIDE%' group by year),
    (select year RobYear, count(*) ROB from jgoldstein3.crime where crime.crimetype like '%ROBBERY%' group by year),
    (select year BurgYear, count(*) BURG from jgoldstein3.crime where crime.crimetype like '%BURGLARY%' group by year),
    (select year as unemYear,round(sum((unemployment/laborforce)*100)/12,2) as Unemployment from jgoldstein3.employment group by year)
    where CrmYear = TheftYear
    and unemYear = TheftYear
    and AsltYear = TheftYear
    and KdnpYear = AsltYear
    and HomYear = KdnpYear
    and Robyear = HomYear
    and BurgYear = RobYear
    order by CrmYear asc
    fetch first 13 rows only) A JOIN (SELECT Year, COUNT(*) AS TotalCrime FROM JGOLDSTEIN3.Crime GROUP BY Year) B ON A.Year = B.Year`;
    const result = await connection.execute(sql);
    return result;
  } catch (error) {
    console.error('Error in query 2:', error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error('Error closing database connection:', error);
      }
    }
  }
}

async function query3() {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const sql = 
    `
    select round(((y11-y10)/y10)*100,2) as "2011",round(((y12-y11)/y11)*100,2) as "2012",
    round(((y13-y12)/y12)*100,2) as "2013",round(((y14-y13)/y13)*100,2) as "2014",round(((y15-y14)/y14)*100,2) as "2015",
    round(((y16-y15)/y15)*100,2) as "2016",round(((y17-y16)/y16)*100,2) as "2017", round(((y18-y17)/y17)*100,2) as "2018",
    round(((y19-y18)/y18)*100,2) as "2019",round(((y20-y19)/y19)*100,2) as "2020",round(((y21-y20)/y20)*100,2) as "2021",
    round(((y22-y21)/y21)*100,2) as "2022"from 
    (select year,round(avg(cpi),2) as y10 from inflation  group by year 
    having year = '2010'),
    (select year,round(avg(cpi),2) as y11 from inflation  group by year 
    having year = '2011'),
    (select year,round(avg(cpi),2) as y12 from inflation  group by year 
    having year = '2012'),
    (select year,round(avg(cpi),2) as y13 from inflation  group by year 
    having year = '2013'),
    (select year,round(avg(cpi),2) as y14 from inflation  group by year 
    having year = '2014'),
    (select year,round(avg(cpi),2) as y15 from inflation  group by year 
    having year = '2015'),
    (select year,round(avg(cpi),2) as y16 from inflation  group by year 
    having year = '2016'),
    (select year,round(avg(cpi),2) as y17 from inflation  group by year 
    having year = '2017'),
    (select year,round(avg(cpi),2) as y18 from inflation  group by year 
    having year = '2018'),
    (select year,round(avg(cpi),2) as y19 from inflation  group by year 
    having year = '2019'),
    (select year,round(avg(cpi),2) as y20 from inflation  group by year 
    having year = '2020'),
    (select year,round(avg(cpi),2) as y21 from inflation  group by year 
    having year = '2021'),
    (select year,round(avg(cpi),2) as y22 from inflation  group by year 
    having year = '2022')
    `;
    const result = await connection.execute(sql);
    return result;
  } catch (error) {
    console.error('Error in query 3:', error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error('Error closing database connection:', error);
      }
    }
  }
}

async function query3p2() {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const sql = 
    `
    select CrmYear as Year, THEFT,ASLT,KDNP,HOM,ROB,BURG from 
(select year CrmYear, count(*) TOTAL from crime group by crime.year),
(select year TheftYear, count(*) THEFT from crime where crime.crimetype like '%THEFT%' group by year),
(select year AsltYear, count(*) ASLT from crime where crime.crimetype like '%ASSAULT%' group by year),
(select year KdnpYear, count(*) KDNP from crime where crime.crimetype like '%KIDNAPPING%' group by year),
(select year HomYear, count(*) HOM from crime where crime.crimetype like '%HOMICIDE%' group by year),
(select year RobYear, count(*) ROB from crime where crime.crimetype like '%ROBBERY%' group by year),
(select year BurgYear, count(*) BURG from crime where crime.crimetype like '%BURGLARY%' group by year)
where CrmYear = TheftYear
and AsltYear = TheftYear
and KdnpYear = AsltYear
and HomYear = KdnpYear
and Robyear = HomYear
and BurgYear = RobYear
order by CrmYear asc
fetch first 13 rows only
    `;
    const result = await connection.execute(sql);
    return result;
  } catch (error) {
    console.error('Error in query 3:', error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error('Error closing database connection:', error);
      }
    }
  }
}

async function query4() {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const sql = 
    `select CrmYear as Year, THEFT,ASLT,KDNP,HOM,ROB,BURG from (select year CrmYear, count(*) TOTAL from jgoldstein3.crime group by crime.year),
    (select year TheftYear, count(*) THEFT from jgoldstein3.crime where crime.crimetype like '%THEFT%' group by year),
    (select year AsltYear, count(*) ASLT from jgoldstein3.crime where crime.crimetype like '%ASSAULT%' group by year),
    (select year KdnpYear, count(*) KDNP from jgoldstein3.crime where crime.crimetype like '%KIDNAPPING%' group by year),
    (select year HomYear, count(*) HOM from jgoldstein3.crime where crime.crimetype like '%HOMICIDE%' group by year),
    (select year RobYear, count(*) ROB from jgoldstein3.crime where crime.crimetype like '%ROBBERY%' group by year),
    (select year BurgYear, count(*) BURG from jgoldstein3.crime where crime.crimetype like '%BURGLARY%' group by year)
    where CrmYear = TheftYear
    and AsltYear = TheftYear
    and KdnpYear = AsltYear
    and HomYear = KdnpYear
    and Robyear = HomYear
    and BurgYear = RobYear
    order by CrmYear asc
    fetch first 13 rows only`
    ;
    const result = await connection.execute(sql);
    return result;
  } catch (error) {
    console.error('Error in query 4:', error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error('Error closing database connection:', error);
      }
    }
  }
}

async function query5() {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const sql = 
    `
    select CrmYear as Year, THEFT,ASLT,KDNP,HOM,ROB,BURG from (select year CrmYear, count(*) TOTAL from jgoldstein3.crime group by crime.year),
    (select year TheftYear, count(*) THEFT from jgoldstein3.crime where crime.crimetype like '%THEFT%' group by year),
    (select year AsltYear, count(*) ASLT from jgoldstein3.crime where crime.crimetype like '%ASSAULT%' group by year),
    (select year KdnpYear, count(*) KDNP from jgoldstein3.crime where crime.crimetype like '%KIDNAPPING%' group by year),
    (select year HomYear, count(*) HOM from jgoldstein3.crime where crime.crimetype like '%HOMICIDE%' group by year),
    (select year RobYear, count(*) ROB from jgoldstein3.crime where crime.crimetype like '%ROBBERY%' group by year),
    (select year BurgYear, count(*) BURG from jgoldstein3.crime where crime.crimetype like '%BURGLARY%' group by year)
    where CrmYear = TheftYear
    and AsltYear = TheftYear
    and KdnpYear = AsltYear
    and HomYear = KdnpYear
    and Robyear = HomYear
    and BurgYear = RobYear
    order by CrmYear asc
    fetch first 13 rows only
    `
    ;
    const result = await connection.execute(sql);
    return result;
  } catch (error) {
    console.error('Error in query 5:', error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error('Error closing database connection:', error);
      }
    }
  }
}

module.exports = {
    query1,
    query2,
    query3,
    query3p2,
    query4,
    query5,
};
