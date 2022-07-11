// Copyright 2021-2022 Ellucian Company L.P. and its affiliates.

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import capitalize from 'lodash/capitalize';
import { Line } from 'react-chartjs-2';
import { useResizeDetector } from 'react-resize-detector';

import { Icon } from '@ellucian/ds-icons/lib';
import { FormControlLabel, FormGroup, IconButton, Switch, Table, TableBody, TableCell, TableHead, TableRow } from '@ellucian/react-design-system/core';
import { spacing40 } from '@ellucian/react-design-system/core/styles/tokens';
import { withStyles } from '@ellucian/react-design-system/core/styles';

import { useCache } from '@ellucian/experience-extension/extension-utilities';

import { randomPathColor } from '../common/util/path';
import { withIntl } from '../common/components/ReactIntlProviderWrapper';

import { dispatchEvent, useEventListener } from '../util/events';

import { initializeLogging } from '../util/log-level';
initializeLogging('Today');

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
    for (const type of types) {
        dispatchEvent({name: `refresh-${type}`, globalFlag: true});
    }
}

function onRefresh(type) {
    dispatchEvent({name: `refresh-${type}`, globalFlag: true});
}

const types = [ 'lambda', 'node', 'proxy' ];
const colorContext = {};
const colors = {};
for ( const type of types ) {
    colors[type] = randomPathColor(colorContext);
}

const TodayClassesDash = ({classes}) => {
    const cache = useCache();
    const intl = useIntl();
    const { width, height, ref: resizeRef } = useResizeDetector();

    const [mode, setMode] = useState('table');
    const [stats, setStats] = useState({});

    useEffect(() => {
        // initialize stats
        for (const type of types) {
            stats[type] = {
                average: 'N/A',
                latest: 'N/A',
                count: 0,
                total: 0,
                times: []
            }
        }
        stats.initialized = true;
        setStats({...stats});

        (async () => {
            const { data: mode } = cache.getItem({key: 'mode'});
            if (mode) {
                setMode(mode);
            }
        })();
    }, []);

    const processTime = useCallback(data => {
        const { type, time } = data;

        let { count, latest, min, max, total } = stats[type];
        const { times } = stats[type];

        latest = time;
        count++;
        min = min !== undefined ? Math.min(min, time) : time;
        max = max !== undefined ? Math.max(max, time) : time;
        total += time;
        const average = Math.round(total / count * 10) / 10;
        times.push(time);

        // store a new stats object to cause a render
        setStats(() => ({
            ...stats,
            [type]: { average, count, latest, min, max, total, times }
        }));
    }, [stats]);

    useEventListener({ name: 'today-load-stats', handler: processTime, globalFlag: true });

    const chartData = useMemo(() => {
        const data = types.reduce(({labels = [], datasets = []}, type) => {
            let newLabels = labels;
            if (stats[type]) {
                const { count, times } = stats[type];
                if (count > labels.length) {
                    // create the labels
                    newLabels = [];
                    for ( let i = 0; i < count; i++ ) {
                        newLabels.push(String(i + 1));
                    }
                }

                datasets.push({
                    label: capitalize(type),
                    data: times.map(time => (Math.round(time / 100) / 10)),
                    fill: false,
                    backgroundColor: colors[type]
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

    function onTableSwitch() {
        setMode('table');
        cache.storeItem({key: 'mode', data: 'table'});
    }

    function onChartSwitch() {
        setMode('chart');
        cache.storeItem({key: 'mode', data: 'chart'});
    }

    if (!stats.initialized) {
        // bail if the stats haven't been initialzed
        return null;
    }

    return (
        <div className={classes.root}>
            <FormGroup className={classes.switchBox} row>
                <div>
                <FormControlLabel
                    control={
                        <Switch checked={mode === 'table'} onChange={() => onTableSwitch()}/>
                    }
                    label="Table"
                />
                <FormControlLabel
                    control={
                        <Switch checked={mode === 'chart'} onChange={() => onChartSwitch()}/>
                    }
                    label="Chart"
                />
                </div>
                <IconButton color="gray" onClick={() => onRefreshAll()}>
                    <Icon name="refresh"/>
                </IconButton>
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
                                <TableCell>{capitalize(type)}</TableCell>
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

TodayClassesDash.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withIntl(withStyles(styles)(TodayClassesDash));
