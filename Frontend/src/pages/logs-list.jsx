import React, { useState, useEffect } from "react";
import NetworkService from "../services/network-service";
import LogsPingHisto from "../models/logsPingHisto";
import LogsScanHisto from "../models/logsScanHisto";
import { Link } from 'react-router-dom';
import "./logs-list.scss";
import LogsItem from "../components/logs-item";
import * as Icon from "react-icons/fc";
import { styled } from '@mui/system';
import TablePaginationUnstyled, {
  tablePaginationUnstyledClasses as classes,
} from '@mui/base/TablePaginationUnstyled';


// type Props = {
//     isSearch: boolean
// };

let timer;

const LogsList = ({isScan}) => {
    const [rows, setlogsPingList] = useState([]);
    const [longueurPingListe, setlongueurPingListe] = useState(0)
    const [nblimit, setnblimit] = useState(500);
    const [commutateur, setcommutateur] = useState(false)

    useEffect(() => {
        if (isScan) {
            setcommutateur(true)
            NetworkService.getLogsScanHisto(nblimit)
            .then((logPingListe) => {
                console.log(logPingListe);
                setlogsPingList(logPingListe);
                NetworkService.getLogsPingcount()
                .then ((rows) => {
                    setlongueurPingListe(rows)
                })
                
            });
        } else {
            setcommutateur(false)
            NetworkService.getLogsPingHisto(nblimit)
            .then((logPingListe) => {
                console.log(logPingListe);
                setlogsPingList(logPingListe);
                NetworkService.getLogsPingcount()
                .then ((rows) => {
                    setlongueurPingListe(rows)
                })
                
            });
        }
    }, [isScan]);

    const CustomTablePagination = styled(TablePaginationUnstyled)`
        & .${classes.toolbar} {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;

            @media (min-width: 768px) {
            flex-direction: row;
            align-items: center;
            }
        }

        & .${classes.selectLabel} {
            margin: auto;
        }

        & .${classes.displayedRows} {
            margin: auto;

            @media (min-width: 768px) {
            margin-left: auto;
            }
        }

        & .${classes.spacer} {
            display: none;
        }

        & .${classes.actions} {
            display: flex;
            gap: 0.25rem;
        }
    `;

    const Root = styled('div')`
        table {
            font-family: arial, sans-serif;
            border-collapse: collapse;
            width: 80%;
            background-color: #2C2D2E;
            margin-left: auto;
            margin-right: auto;
            text-align: center;
            position: absolute;
            margin-left: 100px;

        }

        td,
        th {
            border: 1px solid #ddd;
            text-align: left;
            padding: 8px;
        }

        th {
            background-color: #ddd;
            color: black;
        }
    `;

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(15);
  
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
      page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  
    const handleChangePage = ( event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };


    return (
        <div>
            { isScan  ?
                <h5 className="center">Logs des service actifs</h5> 
                :  <h5 className="center">Logs des éléments actifs</h5>  }
            <Root sx={{ maxWidth: '100%', width: 500 }}>
            <table aria-label="custom pagination table">
                <thead>
                <tr>
                    <th>Nom Device</th>
                    <th>Add IP</th>
                    <th>Categorie</th>
                    <th>Date</th>
                    <th>Heure</th>
                    { isScan && <th>Service</th>}
                </tr>
                </thead>
                <tbody>
                {(rowsPerPage > 0
                    ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : rows
                ).map((row) => (
                    <tr key={row.name}>
                    <td>{row.name}</td>
                    <td style={{ width: 160 }} align="right">
                        {row.ip}
                    </td>
                    <td style={{ width: 160 }} align="right">
                        {row.categorie}
                    </td>
                    <td style={{ width: 160 }} align="right">
                        {row.date}
                    </td>
                    <td style={{ width: 160 }} align="right">
                        {row.heure}
                    </td>
                    { isScan &&
                        <td style={{ width: 160 }} align="right">
                        {row.port}
                    </td>                    
                    }
                    </tr>
                ))}
                {emptyRows > 0 && (
                    <tr style={{ height: 41 * emptyRows }}>
                    <td colSpan={3} />
                    </tr>
                )}
                </tbody>
                <tfoot>
                <tr>
                    <CustomTablePagination
                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                    labelRowsPerPage = {'Pages'}
                    labelDisplayedRows = {function defaultLabelDisplayedRows({ from, to, count }) { return `${from}–${to} de ${count !== -1 ? count : `plus que ${to}`}`; }}
                    colSpan={3}
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    componentsProps={{
                        select: {
                        'aria-label': 'lignes par page',
                        'title' : 'lignes par page'
                        },
                        actions: {
                        showFirstButton: true,
                        showLastButton: true,
                        },
                    }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </tr>
                <tr>
                    <div className="button-form logs">
                    <Link to="/">Retour</Link>
                    </div>
                </tr>
                </tfoot>
            </table>
            
            </Root>
        </div>
    );
}

export default LogsList;