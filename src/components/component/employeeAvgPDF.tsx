'use client'

import React from 'react'
import { Page, Text, Document, StyleSheet, View, Image } from '@react-pdf/renderer'
import { EmployeeAvgResponse } from '../../modules/reports/employeeAvgReport'

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
    width: "25%", // Fixed width for each column
    border: "1px solid #ddd",
    padding: 8,
    textAlign: "center",
  },
  tableColEmployee: {
    width: "25%", // Extended width for the Customer column
    border: "1px solid #ddd",
    padding: 8,
    textAlign: "center",
  },
  tableColError: {
    width: "60%", // Extended width for the Customer column
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
    width: 250,
    height: 70,
    alignSelf: 'center',
  },
  footerText: {
    position: 'absolute',
    fontSize: 10,
    bottom: 10,
    left: 10,
  }
});

const headers = ['Call ID', 'Employee', 'Average Time Per Ticket', 'Total Tickets']

interface Props {
    data: EmployeeAvgResponse,
    starttime: string,
    endtime: string
}

export const EmployeeAvgTimePDF = ({ data, starttime, endtime }: Props) => {
  const startimeFormatted = new Date(starttime).toString().split(' ').slice(1, 5).join(' ');
  const endTimeFormatted = new Date(endtime).toString().split(' ').slice(1, 5).join(' ');
  
  return (
    <Document>
      <Page size="A4" style={styles.body} orientation='landscape'>
        <Image style={styles.image} src="/covers/legendSystems.png" />
        <Text style={styles.header}>Employee Average Time Per Ticket Report</Text>
        <Text style={styles.infoText}>The report was generated from ({startimeFormatted}) to ({endTimeFormatted})</Text> {/* Added info text with formatted date and time */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={[styles.tableColError, styles.tableColHeader]}>
              <Text>Name</Text>
            </View>
            <View style={[styles.tableColError, styles.tableColHeader]}>
              <Text>Surname</Text>
            </View>
            <View style={[styles.tableColError, styles.tableColHeader]}>
              <Text>AVG Time p/Ticket</Text>
            </View>
            <View style={[styles.tableColError, styles.tableColHeader]}>
              <Text>Tasks</Text>
            </View>
            <View style={[styles.tableCol, styles.tableColHeader]}>
              <Text>Total</Text>
            </View>
          </View>
          {data.map((row, rowIndex) => (
            <View key={rowIndex} style={[styles.tableRow, rowIndex % 2 === 0 ? styles.evenRow : {}]}>
              <View style={[styles.tableColError]}>
                <Text>{row.Employee}</Text>
              </View>
              <View style={[styles.tableColError]}>
                <Text>{row.Surname}</Text>
              </View>
              <View style={[styles.tableColError, rowIndex % 2 === 0 ? styles.evenRow : {}]}>
                <Text>{row.AvgTimePerTicket}</Text>
              </View>
              <View style={[styles.tableColError]}>
                <Text>{row.Type}</Text>
              </View>
              <View style={[styles.tableCol]}>
                <Text>{row.EmployeeCount}</Text>
              </View>
            </View>
          ))}
        </View>
        <Text style={styles.footerText}>Emp Avg Report</Text> {/* Added footer text */}
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </Page>
    </Document>
  );
};
