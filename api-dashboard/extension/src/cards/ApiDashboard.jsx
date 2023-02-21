// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

import React, { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { Line } from 'react-chartjs-2';
import { useResizeDetector } from 'react-resize-detector';

import { Icon } from '@ellucian/ds-icons/lib';
import {
    FormControlLabel,
    FormGroup,
    IconButton,
    Radio,
    RadioGroup,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip
} from '@ellucian/react-design-system/core';
import { spacing40 } from '@ellucian/react-design-system/core/styles/tokens';
import { withStyles } from '@ellucian/react-design-system/core/styles';

import { useCache } from '@ellucian/experience-extension-utils';

import { withIntl } from '../i18n/ReactIntlProviderWrapper';

import { dispatchEvent } from '../util/events';

import { ApiDashboardProvider, useApiDashboard } from '../context/api-dashboard';

import { initializeLogging } from '../util/log-level';
initializeLogging('Today');

const cacheKey = 'api-dashboard-mode';

const styles = () => ({
    root: {
        height: '100%',
        marginTop: 0,
        marginRight: spacing40,
        marginBottom: 0,
        marginLeft: spacing40,
        display: 'flex',
        flexDirection: 'column'
    },
    modeRadioGroup: {
        display: 'flex',
        flexDirection: 'row'
    },
    switchBox: {
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: spacing40
    },
    chartBox: {
        height: '100%'
    }
});

function onRefreshAll() {
    dispatchEvent({ name: 'refresh', data: {} });
}

function onRefresh(type) {
    dispatchEvent({ name: 'refresh', data: { type } });
}

const ApiDashboard = ({classes}) => {
    const { getItem, storeItem } = useCache();
    const intl = useIntl();
    const { width, height, ref: resizeRef } = useResizeDetector();

    const { clear, stats, types } = useApiDashboard();

    const [mode, setMode] = useState('table');

    useEffect(() => {
        const { data: mode } = getItem({key: cacheKey});
        if (mode) {
            setMode(mode);
        }
    }, []);

    const chartData = useMemo(() => {
        const data = types.reduce(({labels = [], datasets = []}, type) => {
            let newLabels = labels;
            if (stats[type]) {
                const { color, count, times } = stats[type];
                if (count > labels.length) {
                    // create the labels
                    newLabels = [];
                    for ( let i = 0; i < count; i++ ) {
                        newLabels.push(String(i + 1));
                    }
                }

                datasets.push({
                    label: type,
                    data: times.map(time => (Math.round(time / 100) / 10)),
                    fill: false,
                    backgroundColor: color
                });
            }

            return {
                labels: newLabels,
                datasets,
                options: {
                    responsive: false,
                    maintainAspectRatio: false
                }
            }
        }, {});

        return data;
    }, [stats]);

    function onModeChange(event) {
        const { target: { value } } = event;
        setMode(value);
        storeItem({key: cacheKey, data: value});
    }

    function onClear() {
        clear();
    }

    return (
        <div className={classes.root}>
            <FormGroup className={classes.switchBox} row>
                <RadioGroup className={classes.modeRadioGroup} onChange={onModeChange} value={mode}>
                    <FormControlLabel
                        value="table"
                        control={<Radio/>}
                        label="Table"
                    />
                    <FormControlLabel
                        value="chart"
                        control={<Radio/>}
                        label="Chart"
                    />
                </RadioGroup>
                <div>
                    <Tooltip title={intl.formatMessage({id: 'Dash.clear'})}>
                        <IconButton color="gray" onClick={() => onClear()}>
                            <Icon name="trash"/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={intl.formatMessage({id: 'Dash.refresh'})}>
                        <IconButton color="gray" onClick={() => onRefreshAll()}>
                            <Icon name="refresh"/>
                        </IconButton>
                    </Tooltip>
                </div>
            </FormGroup>
            {mode === 'table' && (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                {intl.formatMessage({id: 'Dash.source'})}
                            </TableCell>
                            <TableCell>
                                {intl.formatMessage({id: 'Dash.count'})}
                            </TableCell>
                            <TableCell>
                                {intl.formatMessage({id: 'Dash.average'})}
                            </TableCell>
                            <TableCell>
                                {intl.formatMessage({id: 'Dash.actions'})}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {types.map( type => (
                            <TableRow key={type}>
                                <TableCell>{type}</TableCell>
                                <TableCell>{stats[type].count}</TableCell>
                                <TableCell>{stats[type].average}</TableCell>
                                <TableCell>
                                    <IconButton color="gray" onClick={() => onRefresh(type)}>
                                        <Icon name="refresh"/>
                                    </IconButton>
                                    </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
            {mode === 'chart' && (
                <div className={classes.chartBox} ref={resizeRef}>
                    <Line className={classes.chart} data={chartData} width={width} height={height}/>
                </div>
            )}
        </div>
    );
};

ApiDashboard.propTypes = {
    classes: PropTypes.object.isRequired
};

const ApiDashboardWithStyle = withStyles(styles)(ApiDashboard);

function ApiDashboardWithProviders() {
    return (
        <ApiDashboardProvider>
            <ApiDashboardWithStyle/>
        </ApiDashboardProvider>
    )
}

export default withIntl(ApiDashboardWithProviders);
