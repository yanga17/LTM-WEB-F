'use client'

import React from 'react'
import { Page, Text, Document, StyleSheet, View, Image } from '@react-pdf/renderer'
import { EmployeeSumResponse } from '../../modules/reports/employeeSummaryReport'

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  table: {
    display: "flex",
    width: "auto",
    borderCollapse: "collapse",
  },
  tableRow: {
    flexDirection: "row"
  },
  header: {
    fontSize: 24,
    marginBottom: 10,
    marginTop: 10,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center',
  },
  tableCol: {
    width: "100px", 
    border: "1px solid #ddd",
    padding: 8,
    textAlign: "left",
  },
  tableColEmployee: {
    width: "340px",
    border: "1px solid #ddd",
    padding: 8,
    textAlign: "center",
  },
  tableColDays: {
    width: "200px",
    border: "1px solid #ddd",
    padding: 8,
    textAlign: "center",
  },
  tableColHeader: {
    backgroundColor: "#04AA6D",
    color: "white",
    paddingTop: 2,
    paddingBottom: 2,
  },
  evenRow: {
    backgroundColor: "#f2f2f2",
  },
  hoverRow: {
    backgroundColor: "#ddd",
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 10,
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  image: {
    // marginBottom: 20,
    width: 200,
    height: 30,
    float: 'left',
  },
  footerText: {
    position: 'absolute',
    fontSize: 10,
    bottom: 10,
    left: 10,
  }
});


interface Props {
    data: EmployeeSumResponse,
    starttime: string,
    endtime: string
}

export const EmployeeSummaryPDF = ({ data, starttime, endtime }: Props) => {
  const startimeFormatted = new Date(starttime).toString().split(' ').slice(1, 5).join(' ');
  const endTimeFormatted = new Date(endtime).toString().split(' ').slice(1, 5).join(' ');

    // Calculate totals for each day
    const totalMonday = data.reduce((total, row) => total + row.Monday, 0);
    const totalTuesday = data.reduce((total, row) => total + row.Tuesday, 0);
    const totalWednesday = data.reduce((total, row) => total + row.Wednesday, 0);
    const totalThursday = data.reduce((total, row) => total + row.Thursday, 0);
    const totalFriday = data.reduce((total, row) => total + row.Friday, 0);
    const totalSaturday = data.reduce((total, row) => total + row.Saturday, 0);
    const totalSunday = data.reduce((total, row) => total + row.Sunday, 0);
    const totalOverall = data.reduce((total, row) => total + row.OverallTotal, 0);
  
  return (
    <Document>
      <Page size="A4" style={styles.body} orientation='landscape'>
        <Image style={styles.image} src="/covers/legendSystems.png" />
        <Text style={styles.header}>Employee Summary Report</Text>
        <Text style={styles.infoText}>The report was generated from ({startimeFormatted}) to ({endTimeFormatted})</Text> {/* Added info text with formatted date and time */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={[styles.tableColEmployee, styles.tableColHeader]}>
              <Text>Name</Text>
            </View>
            <View style={[styles.tableColEmployee, styles.tableColHeader]}>
              <Text>Surname</Text>
            </View>
            <View style={[styles.tableColDays, styles.tableColHeader]}>
              <Text>Mon</Text>
            </View>
            <View style={[styles.tableColDays, styles.tableColHeader]}>
              <Text>Tue</Text>
            </View>
            <View style={[styles.tableColDays, styles.tableColHeader]}>
              <Text>Wed</Text>
            </View>
            <View style={[styles.tableColDays, styles.tableColHeader]}>
              <Text>Thur</Text>
            </View>
            <View style={[styles.tableColDays, styles.tableColHeader]}>
              <Text>Fri</Text>
            </View>
            <View style={[styles.tableColDays, styles.tableColHeader]}>
              <Text>Sat</Text>
            </View>
            <View style={[styles.tableColDays, styles.tableColHeader]}>
              <Text>Sun</Text>
            </View>
            <View style={[styles.tableColDays, styles.tableColHeader]}>
              <Text>Total</Text>
            </View>
          </View>
          {data.map((row, rowIndex) => (
            <View key={rowIndex} style={[styles.tableRow, rowIndex % 2 === 0 ? styles.evenRow : {}]}>
              <View style={[styles.tableColEmployee]}>
                <Text>{row.Employee.toLocaleUpperCase()}</Text>
              </View>
              <View style={[styles.tableColEmployee]}>
                <Text>{row.Surname.toLocaleUpperCase()}</Text>
              </View>
              <View style={[styles.tableColDays]}>
                <Text>{row.Monday}</Text>
              </View>
              <View style={[styles.tableColDays]}>
                <Text>{row.Tuesday}</Text>
              </View>
              <View style={[styles.tableColDays]}>
                <Text>{row.Wednesday}</Text>
              </View>
              <View style={[styles.tableColDays]}>
                <Text>{row.Thursday}</Text>
              </View>
              <View style={[styles.tableColDays]}>
                <Text>{row.Friday}</Text>
              </View>
              <View style={[styles.tableColDays]}>
                <Text>{row.Saturday}</Text>
              </View>
              <View style={[styles.tableColDays]}>
                <Text>{row.Sunday}</Text>
              </View>
              <View style={[styles.tableColDays]}>
                <Text>{row.OverallTotal}</Text>
              </View>
            </View>
          ))}
          {/* Total Row */}
          <View style={[styles.tableRow, { backgroundColor: '#d3d3d3' }]}>
            <View style={[styles.tableColEmployee]}>
              <Text>Total</Text>
            </View>
            <View style={[styles.tableColEmployee]}>
              <Text>--:--</Text>
            </View>
            <View style={[styles.tableColDays]}>
              <Text>{totalMonday || '--:--'}</Text>
            </View>
            <View style={[styles.tableColDays]}>
              <Text>{totalTuesday || '--:--'}</Text>
            </View>
            <View style={[styles.tableColDays]}>
              <Text>{totalWednesday || '--:--'}</Text>
            </View>
            <View style={[styles.tableColDays]}>
              <Text>{totalThursday || '--:--'}</Text>
            </View>
            <View style={[styles.tableColDays]}>
              <Text>{totalFriday || '--:--'}</Text>
            </View>
            <View style={[styles.tableColDays]}>
              <Text>{totalSaturday || '--:--'}</Text>
            </View>
            <View style={[styles.tableColDays]}>
              <Text>{totalSunday || '--:--'}</Text>
            </View>
            <View style={[styles.tableColDays]}>
              <Text>{totalOverall || '--:--'}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.footerText}>Emp Summary</Text> {/* Added footer text */}
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </Page>
    </Document>
  );
};
