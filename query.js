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
    jgoldstein3.victim
    JOIN 
    jgoldstein3.crime ON victim.crimeid = crime.crimeid 
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
    `SELECT A.Year, Unemployment, round(THEFT/TotalCrime,2) AS Theft, round(ASLT/TotalCrime,2) AS Assault, round(KDNP/TotalCrime,2) AS Kidnapping, round(HOM/TotalCrime,2) AS Homicide, round(ROB/TotalCrime,2) AS Robbery, round(BURG/TotalCrime,2) AS Burglary
    FROM (select CrmYear as Year, THEFT,ASLT,KDNP,HOM,ROB,BURG,Unemployment from 
    (select year CrmYear, count(*) TOTAL from jgoldstein3.crime group by crime.year),
    (select year TheftYear, count(*) THEFT from jgoldstein3.crime where crime.crimetype like '%THEFT%' group by year),
    (select year AsltYear, count(*) ASLT from jgoldstein3.crime where crime.crimetype like '%ASSAULT%' group by year),
    (select year KdnpYear, count(*) KDNP from jgoldstein3.crime where crime.crimetype like '%KIDNAPPING%' group by year),
    (select year HomYear, count(*) HOM from jgoldstein3.crime where crime.crimetype like '%HOMICIDE%' group by year),
    (select year RobYear, count(*) ROB from jgoldstein3.crime where crime.crimetype like '%ROBBERY%' group by year),
    (select year BurgYear, count(*) BURG from jgoldstein3.crime where crime.crimetype like '%BURGLARY%' group by year),
    (select year as unemYear,round(sum((unemployment/laborforce))/12,2) as Unemployment from jgoldstein3.employment group by year)
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
    (select year,round(avg(cpi),2) as y10 from jgoldstein3.inflation  group by year 
    having year = '2010'),
    (select year,round(avg(cpi),2) as y11 from jgoldstein3.inflation  group by year 
    having year = '2011'),
    (select year,round(avg(cpi),2) as y12 from jgoldstein3.inflation  group by year 
    having year = '2012'),
    (select year,round(avg(cpi),2) as y13 from jgoldstein3.inflation  group by year 
    having year = '2013'),
    (select year,round(avg(cpi),2) as y14 from jgoldstein3.inflation  group by year 
    having year = '2014'),
    (select year,round(avg(cpi),2) as y15 from jgoldstein3.inflation  group by year 
    having year = '2015'),
    (select year,round(avg(cpi),2) as y16 from jgoldstein3.inflation  group by year 
    having year = '2016'),
    (select year,round(avg(cpi),2) as y17 from jgoldstein3.inflation  group by year 
    having year = '2017'),
    (select year,round(avg(cpi),2) as y18 from jgoldstein3.inflation  group by year 
    having year = '2018'),
    (select year,round(avg(cpi),2) as y19 from jgoldstein3.inflation  group by year 
    having year = '2019'),
    (select year,round(avg(cpi),2) as y20 from jgoldstein3.inflation  group by year 
    having year = '2020'),
    (select year,round(avg(cpi),2) as y21 from jgoldstein3.inflation  group by year 
    having year = '2021'),
    (select year,round(avg(cpi),2) as y22 from jgoldstein3.inflation  group by year 
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
(select year CrmYear, count(*) TOTAL from jgoldstein3.crime group by crime.year),
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
    `select CrmYear as Year, floor((TOTAL/POP)*100000) as "Per-100k Crime" , floor((THEFT/POP)*100000) as "Per-100k Theft"
    ,floor((ASLT/POP)*100000) as "Per-100k Assault",floor((KDNP/POP)*100000) as "Per-100k Kidnapping"
    ,floor((HOM/POP)*100000) as "Per-100k Homicide",floor((ROB/POP)*100000) as "Per-100k Robbery",
    floor((BURG/POP)*100000) as "Per-100k Burglary" from 
    (select year CrmYear, count(*) TOTAL from jgoldstein3.crime group by crime.year),
    (select year PopYear,population POP from jgoldstein3.population),
    (select year TheftYear, count(*) THEFT from jgoldstein3.crime where jgoldstein3.crime.crimetype like '%THEFT%' group by year),
    (select year AsltYear, count(*) ASLT from jgoldstein3.crime where jgoldstein3.crime.crimetype like '%ASSAULT%' group by year),
    (select year KdnpYear, count(*) KDNP from jgoldstein3.crime where jgoldstein3.crime.crimetype like '%KIDNAPPING%' group by year),
    (select year HomYear, count(*) HOM from jgoldstein3.crime where jgoldstein3.crime.crimetype like '%HOMICIDE%' group by year),
    (select year RobYear, count(*) ROB from jgoldstein3.crime where jgoldstein3.crime.crimetype like '%ROBBERY%' group by year),
    (select year BurgYear, count(*) BURG from jgoldstein3.crime where jgoldstein3.crime.crimetype like '%BURGLARY%' group by year)
    where CrmYear = PopYear
    and PopYear = TheftYear
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

async function query5p1() {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const sql = 
    `
      with Top10Crime as (
      select year, area, count(area) as ChristmasCrime,
      row_number() over (partition by year order by count(area) desc) as CrimeRank
      from jgoldstein3.premise join jgoldstein3.crime on premise.crimeid = crime.crimeid
      where
      (
      (year = '2022' AND month = 'DEC' AND day BETWEEN 19 AND 31) OR
      (year = '2021' AND month = 'DEC' AND day BETWEEN 19 AND 31) OR
      (year = '2020' AND month = 'DEC' AND day BETWEEN 19 AND 31) OR
      (year = '2019' AND month = 'DEC' AND day BETWEEN 19 AND 31) OR
      (year = '2018' AND month = 'DEC' AND day BETWEEN 19 AND 31) OR
      (year = '2017' AND month = 'DEC' AND day BETWEEN 19 AND 31) OR
      (year = '2016' AND month = 'DEC' AND day BETWEEN 19 AND 31) OR
      (year = '2015' AND month = 'DEC' AND day BETWEEN 19 AND 31) OR
      (year = '2014' AND month = 'DEC' AND day BETWEEN 19 AND 31) OR
      (year = '2013' AND month = 'DEC' AND day BETWEEN 19 AND 31) OR
      (year = '2012' AND month = 'DEC' AND day BETWEEN 19 AND 31) OR
      (year = '2011' AND month = 'DEC' AND day BETWEEN 19 AND 31) OR
      (year = '2010' AND month = 'DEC' AND day BETWEEN 19 AND 31)
      ) group by year, area
      ) select year,
      max(case when CrimeRank = 1 then area end) as TopArea1,
      max(case when CrimeRank = 1 then ChristmasCrime end) as TopCrime1,
      max(case when CrimeRank = 2 then area end) as TopArea2,
      max(case when CrimeRank = 2 then ChristmasCrime end) as TopCrime2,
      max(case when CrimeRank = 3 then area end) as TopArea3,
      max(case when CrimeRank = 3 then ChristmasCrime end) as TopCrime3,
      max(case when CrimeRank = 4 then area end) as TopArea4,
      max(case when CrimeRank = 4 then ChristmasCrime end) as TopCrime4,
      max(case when CrimeRank = 5 then area end) as TopArea5,
      max(case when CrimeRank = 5 then ChristmasCrime end) as TopCrime5,
      max(case when CrimeRank = 6 then area end) as TopArea6,
      max(case when CrimeRank = 6 then ChristmasCrime end) as TopCrime6,
      max(case when CrimeRank = 7 then area end) as TopArea7,
      max(case when CrimeRank = 7 then ChristmasCrime end) as TopCrime7,
      max(case when CrimeRank = 8 then area end) as TopArea8,
      max(case when CrimeRank = 8 then ChristmasCrime end) as TopCrime8,
      max(case when CrimeRank = 9 then area end) as TopArea9,
      max(case when CrimeRank = 9 then ChristmasCrime end) as TopCrime9,
      max(case when CrimeRank = 10 then area end) as TopArea10,
      max(case when CrimeRank = 10 then ChristmasCrime end) as TopCrime10
      from Top10Crime group by year order by year asc `
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

async function query5p2() {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const sql = 
    `
      WITH Top10Crime AS (
      SELECT year, area, COUNT(area) AS NewYearsCrime,
      ROW_NUMBER() OVER (PARTITION BY year ORDER BY COUNT(area) DESC) AS CrimeRank
      FROM jgoldstein3.premise JOIN jgoldstein3.crime ON premise.crimeid = crime.crimeid
      WHERE
      (
      (year = '2022' AND month = 'JAN' AND day BETWEEN 0 AND 2) OR
      (year = '2021' AND month = 'JAN' AND day BETWEEN 0 AND 2) OR
      (year = '2020' AND month = 'JAN' AND day BETWEEN 0 AND 2) OR
      (year = '2019' AND month = 'JAN' AND day BETWEEN 0 AND 2) OR
      (year = '2018' AND month = 'JAN' AND day BETWEEN 0 AND 2) OR
      (year = '2017' AND month = 'JAN' AND day BETWEEN 0 AND 2) OR
      (year = '2016' AND month = 'JAN' AND day BETWEEN 0 AND 2) OR
      (year = '2015' AND month = 'JAN' AND day BETWEEN 0 AND 2) OR
      (year = '2014' AND month = 'JAN' AND day BETWEEN 0 AND 2) OR
      (year = '2013' AND month = 'JAN' AND day BETWEEN 0 AND 2) OR
      (year = '2012' AND month = 'JAN' AND day BETWEEN 0 AND 2) OR
      (year = '2011' AND month = 'JAN' AND day BETWEEN 0 AND 2) OR
      (year = '2010' AND month = 'JAN' AND day BETWEEN 0 AND 2)
      ) GROUP BY year, area
      ) SELECT year,
      MAX(CASE WHEN CrimeRank = 1 THEN area END) AS TopArea1,
      MAX(CASE WHEN CrimeRank = 1 THEN NewYearsCrime END) AS TopCrime1,
      MAX(CASE WHEN CrimeRank = 2 THEN area END) AS TopArea2,
      MAX(CASE WHEN CrimeRank = 2 THEN NewYearsCrime END) AS TopCrime2,
      MAX(CASE WHEN CrimeRank = 3 THEN area END) AS TopArea3,
      MAX(CASE WHEN CrimeRank = 3 THEN NewYearsCrime END) AS TopCrime3,
      MAX(CASE WHEN CrimeRank = 4 THEN area END) AS TopArea4,
      MAX(CASE WHEN CrimeRank = 4 THEN NewYearsCrime END) AS TopCrime4,
      MAX(CASE WHEN CrimeRank = 5 THEN area END) AS TopArea5,
      MAX(CASE WHEN CrimeRank = 5 THEN NewYearsCrime END) AS TopCrime5,
      MAX(CASE WHEN CrimeRank = 6 THEN area END) AS TopArea6,
      MAX(CASE WHEN CrimeRank = 6 THEN NewYearsCrime END) AS TopCrime6,
      MAX(CASE WHEN CrimeRank = 7 THEN area END) AS TopArea7,
      MAX(CASE WHEN CrimeRank = 7 THEN NewYearsCrime END) AS TopCrime7,
      MAX(CASE WHEN CrimeRank = 8 THEN area END) AS TopArea8,
      MAX(CASE WHEN CrimeRank = 8 THEN NewYearsCrime END) AS TopCrime8,
      MAX(CASE WHEN CrimeRank = 9 THEN area END) AS TopArea9,
      MAX(CASE WHEN CrimeRank = 9 THEN NewYearsCrime END) AS TopCrime9,
      MAX(CASE WHEN CrimeRank = 10 THEN area END) AS TopArea10,
      MAX(CASE WHEN CrimeRank = 10 THEN NewYearsCrime END) AS TopCrime10
      FROM Top10Crime GROUP BY year ORDER BY year asc
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

async function query5p3() {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const sql = 
    `
      WITH Top10Crime AS (
      SELECT year, area, COUNT(area) AS ThanksgivingCrime,
      ROW_NUMBER() OVER (PARTITION BY year ORDER BY COUNT(area) DESC) AS CrimeRank
      FROM jgoldstein3.premise JOIN jgoldstein3.crime ON premise.crimeid = crime.crimeid
      WHERE
      (
      (year = '2022' AND month = 'NOV' AND day BETWEEN 20 AND 27) OR
      (year = '2021' AND month = 'NOV' AND day BETWEEN 20 AND 27) OR
      (year = '2020' AND month = 'NOV' AND day BETWEEN 20 AND 27) OR
      (year = '2019' AND month = 'NOV' AND day BETWEEN 20 AND 27) OR
      (year = '2018' AND month = 'NOV' AND day BETWEEN 20 AND 27) OR
      (year = '2017' AND month = 'NOV' AND day BETWEEN 20 AND 27) OR
      (year = '2016' AND month = 'NOV' AND day BETWEEN 20 AND 27) OR
      (year = '2015' AND month = 'NOV' AND day BETWEEN 20 AND 27) OR
      (year = '2014' AND month = 'NOV' AND day BETWEEN 20 AND 27) OR
      (year = '2013' AND month = 'NOV' AND day BETWEEN 20 AND 27) OR
      (year = '2012' AND month = 'NOV' AND day BETWEEN 20 AND 27) OR
      (year = '2011' AND month = 'NOV' AND day BETWEEN 20 AND 27) OR
      (year = '2010' AND month = 'NOV' AND day BETWEEN 20 AND 27)
      ) GROUP BY year, area
      ) SELECT year,
      MAX(CASE WHEN CrimeRank = 1 THEN area END) AS TopArea1,
      MAX(CASE WHEN CrimeRank = 1 THEN ThanksgivingCrime END) AS TopCrime1,
      MAX(CASE WHEN CrimeRank = 2 THEN area END) AS TopArea2,
      MAX(CASE WHEN CrimeRank = 2 THEN ThanksgivingCrime END) AS TopCrime2,
      MAX(CASE WHEN CrimeRank = 3 THEN area END) AS TopArea3,
      MAX(CASE WHEN CrimeRank = 3 THEN ThanksgivingCrime END) AS TopCrime3,
      MAX(CASE WHEN CrimeRank = 4 THEN area END) AS TopArea4,
      MAX(CASE WHEN CrimeRank = 4 THEN ThanksgivingCrime END) AS TopCrime4,
      MAX(CASE WHEN CrimeRank = 5 THEN area END) AS TopArea5,
      MAX(CASE WHEN CrimeRank = 5 THEN ThanksgivingCrime END) AS TopCrime5,
      MAX(CASE WHEN CrimeRank = 6 THEN area END) AS TopArea6,
      MAX(CASE WHEN CrimeRank = 6 THEN ThanksgivingCrime END) AS TopCrime6,
      MAX(CASE WHEN CrimeRank = 7 THEN area END) AS TopArea7,
      MAX(CASE WHEN CrimeRank = 7 THEN ThanksgivingCrime END) AS TopCrime7,
      MAX(CASE WHEN CrimeRank = 8 THEN area END) AS TopArea8,
      MAX(CASE WHEN CrimeRank = 8 THEN ThanksgivingCrime END) AS TopCrime8,
      MAX(CASE WHEN CrimeRank = 9 THEN area END) AS TopArea9,
      MAX(CASE WHEN CrimeRank = 9 THEN ThanksgivingCrime END) AS TopCrime9,
      MAX(CASE WHEN CrimeRank = 10 THEN area END) AS TopArea10,
      MAX(CASE WHEN CrimeRank = 10 THEN ThanksgivingCrime END) AS TopCrime10
      FROM Top10Crime GROUP BY year ORDER BY year asc `
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

async function query5p4() {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const sql = 
    `
      WITH Top10Crime AS (
      SELECT year, area, COUNT(area) AS JulyFourthCrime,
      ROW_NUMBER() OVER (PARTITION BY year ORDER BY COUNT(area) DESC) AS CrimeRank
      FROM jgoldstein3.premise JOIN jgoldstein3.crime ON premise.crimeid = crime.crimeid
      WHERE
      (
          (year = '2022' AND month = 'JUL' AND day BETWEEN 2 AND 6) OR
          (year = '2021' AND month = 'JUL' AND day BETWEEN 2 AND 6) OR
          (year = '2020' AND month = 'JUL' AND day BETWEEN 2 AND 6) OR
          (year = '2019' AND month = 'JUL' AND day BETWEEN 2 AND 6) OR
          (year = '2018' AND month = 'JUL' AND day BETWEEN 2 AND 6) OR
          (year = '2017' AND month = 'JUL' AND day BETWEEN 2 AND 6) OR
          (year = '2016' AND month = 'JUL' AND day BETWEEN 2 AND 6) OR
          (year = '2015' AND month = 'JUL' AND day BETWEEN 2 AND 6) OR
          (year = '2014' AND month = 'JUL' AND day BETWEEN 2 AND 6) OR
          (year = '2013' AND month = 'JUL' AND day BETWEEN 2 AND 6) OR
          (year = '2012' AND month = 'JUL' AND day BETWEEN 2 AND 6) OR
          (year = '2011' AND month = 'JUL' AND day BETWEEN 2 AND 6) OR
          (year = '2010' AND month = 'JUL' AND day BETWEEN 2 AND 6)
      ) GROUP BY year, area
      ) SELECT year,
      MAX(CASE WHEN CrimeRank = 1 THEN area END) AS TopArea1,
      MAX(CASE WHEN CrimeRank = 1 THEN JulyFourthCrime END) AS TopCrime1,
      MAX(CASE WHEN CrimeRank = 2 THEN area END) AS TopArea2,
      MAX(CASE WHEN CrimeRank = 2 THEN JulyFourthCrime END) AS TopCrime2,
      MAX(CASE WHEN CrimeRank = 3 THEN area END) AS TopArea3,
      MAX(CASE WHEN CrimeRank = 3 THEN JulyFourthCrime END) AS TopCrime3,
      MAX(CASE WHEN CrimeRank = 4 THEN area END) AS TopArea4,
      MAX(CASE WHEN CrimeRank = 4 THEN JulyFourthCrime END) AS TopCrime4,
      MAX(CASE WHEN CrimeRank = 5 THEN area END) AS TopArea5,
      MAX(CASE WHEN CrimeRank = 5 THEN JulyFourthCrime END) AS TopCrime5,
      MAX(CASE WHEN CrimeRank = 6 THEN area END) AS TopArea6,
      MAX(CASE WHEN CrimeRank = 6 THEN JulyFourthCrime END) AS TopCrime6,
      MAX(CASE WHEN CrimeRank = 7 THEN area END) AS TopArea7,
      MAX(CASE WHEN CrimeRank = 7 THEN JulyFourthCrime END) AS TopCrime7,
      MAX(CASE WHEN CrimeRank = 8 THEN area END) AS TopArea8,
      MAX(CASE WHEN CrimeRank = 8 THEN JulyFourthCrime END) AS TopCrime8,
      MAX(CASE WHEN CrimeRank = 9 THEN area END) AS TopArea9,
      MAX(CASE WHEN CrimeRank = 9 THEN JulyFourthCrime END) AS TopCrime9,
      MAX(CASE WHEN CrimeRank = 10 THEN area END) AS TopArea10,
      MAX(CASE WHEN CrimeRank = 10 THEN JulyFourthCrime END) AS TopCrime10
      FROM Top10Crime GROUP BY year ORDER BY year asc `
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

async function query5p5() {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const sql = 
    `
      WITH Top10Crime AS (
      SELECT year, area, COUNT(area) AS HalloweenCrime,
      ROW_NUMBER() OVER (PARTITION BY year ORDER BY COUNT(area) DESC) AS CrimeRank
      FROM jgoldstein3.premise JOIN jgoldstein3.crime ON premise.crimeid = crime.crimeid
      WHERE
      (
          (year = '2022' AND month = 'OCT' AND day BETWEEN 28 AND 32) OR
          (year = '2021' AND month = 'OCT' AND day BETWEEN 28 AND 32) OR
          (year = '2020' AND month = 'OCT' AND day BETWEEN 28 AND 32) OR
          (year = '2019' AND month = 'OCT' AND day BETWEEN 28 AND 32) OR
          (year = '2018' AND month = 'OCT' AND day BETWEEN 28 AND 32) OR
          (year = '2017' AND month = 'OCT' AND day BETWEEN 28 AND 32) OR
          (year = '2016' AND month = 'OCT' AND day BETWEEN 28 AND 32) OR
          (year = '2015' AND month = 'OCT' AND day BETWEEN 28 AND 32) OR
          (year = '2014' AND month = 'OCT' AND day BETWEEN 28 AND 32) OR
          (year = '2013' AND month = 'OCT' AND day BETWEEN 28 AND 32) OR
          (year = '2012' AND month = 'OCT' AND day BETWEEN 28 AND 32) OR
          (year = '2011' AND month = 'OCT' AND day BETWEEN 28 AND 32) OR
          (year = '2010' AND month = 'OCT' AND day BETWEEN 28 AND 32)
      ) GROUP BY year, area
      ) SELECT year,
      MAX(CASE WHEN CrimeRank = 1 THEN area END) AS TopArea1,
      MAX(CASE WHEN CrimeRank = 1 THEN HalloweenCrime END) AS TopCrime1,
      MAX(CASE WHEN CrimeRank = 2 THEN area END) AS TopArea2,
      MAX(CASE WHEN CrimeRank = 2 THEN HalloweenCrime END) AS TopCrime2,
      MAX(CASE WHEN CrimeRank = 3 THEN area END) AS TopArea3,
      MAX(CASE WHEN CrimeRank = 3 THEN HalloweenCrime END) AS TopCrime3,
      MAX(CASE WHEN CrimeRank = 4 THEN area END) AS TopArea4,
      MAX(CASE WHEN CrimeRank = 4 THEN HalloweenCrime END) AS TopCrime4,
      MAX(CASE WHEN CrimeRank = 5 THEN area END) AS TopArea5,
      MAX(CASE WHEN CrimeRank = 5 THEN HalloweenCrime END) AS TopCrime5,
      MAX(CASE WHEN CrimeRank = 6 THEN area END) AS TopArea6,
      MAX(CASE WHEN CrimeRank = 6 THEN HalloweenCrime END) AS TopCrime6,
      MAX(CASE WHEN CrimeRank = 7 THEN area END) AS TopArea7,
      MAX(CASE WHEN CrimeRank = 7 THEN HalloweenCrime END) AS TopCrime7,
      MAX(CASE WHEN CrimeRank = 8 THEN area END) AS TopArea8,
      MAX(CASE WHEN CrimeRank = 8 THEN HalloweenCrime END) AS TopCrime8,
      MAX(CASE WHEN CrimeRank = 9 THEN area END) AS TopArea9,
      MAX(CASE WHEN CrimeRank = 9 THEN HalloweenCrime END) AS TopCrime9,
      MAX(CASE WHEN CrimeRank = 10 THEN area END) AS TopArea10,
      MAX(CASE WHEN CrimeRank = 10 THEN HalloweenCrime END) AS TopCrime10
      FROM Top10Crime GROUP BY year ORDER BY year asc `
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
    query5p1,
    query5p2,
    query5p3,
    query5p4,
    query5p5,
};
