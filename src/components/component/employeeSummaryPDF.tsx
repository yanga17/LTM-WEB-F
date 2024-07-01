'use client'

import React from 'react'
import { Page, Text, Document, StyleSheet, View } from '@react-pdf/renderer'
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
    marginBottom: 20,
    marginTop: 20,
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
    width: "300px",
    border: "1px solid #ddd",
    padding: 8,
    textAlign: "left",
  },
  tableColDays: {
    width: "260px",
    border: "1px solid #ddd",
    padding: 8,
    textAlign: "left",
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
  }
});


interface Props {
    data: EmployeeSumResponse,
    starttime: string,
    endtime: string
}

export const EmployeeSummaryPDF = ({ data, starttime, endtime }: Props) => {
  const startimeFormatted = new Date(starttime).toLocaleString();
  const endTimeFormatted = new Date(endtime).toLocaleString();
  return (
    <Document>
      <Page size="A4" style={styles.body} orientation='landscape'>
        <Text style={styles.header}>Employee Summary Report</Text>
        <Text style={styles.infoText}>The report was generated from ({startimeFormatted}) to ({endTimeFormatted})</Text> {/* Added info text with formatted date and time */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={[styles.tableColEmployee, styles.tableColHeader]}>
              <Text>Employee</Text>
            </View>
            <View style={[styles.tableColDays, styles.tableColHeader]}>
              <Text>Monday</Text>
            </View>
            <View style={[styles.tableColDays, styles.tableColHeader]}>
              <Text>Tuesday</Text>
            </View>
            <View style={[styles.tableColDays, styles.tableColHeader]}>
              <Text>Wednesday</Text>
            </View>
            <View style={[styles.tableColDays, styles.tableColHeader]}>
              <Text>Thursday</Text>
            </View>
            <View style={[styles.tableColDays, styles.tableColHeader]}>
              <Text>Friday</Text>
            </View>
            <View style={[styles.tableColDays, styles.tableColHeader]}>
              <Text>Saturday</Text>
            </View>
            <View style={[styles.tableColDays, styles.tableColHeader]}>
              <Text>Sunday</Text>
            </View>
            <View style={[styles.tableColDays, styles.tableColHeader]}>
              <Text>Total</Text>
            </View>
          </View>
          {data.map((row, rowIndex) => (
            <View key={rowIndex} style={[styles.tableRow, rowIndex % 2 === 0 ? styles.evenRow : {}]}>
              <View style={[styles.tableColEmployee]}>
                <Text>{row.Employee}</Text>
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
        </View>
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </Page>
    </Document>
  );
};
