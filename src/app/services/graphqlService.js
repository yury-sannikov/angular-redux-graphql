import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';

import {InMemoryCache} from 'apollo-cache-inmemory';
import {ApolloLink} from 'apollo-link';
import {getOperationAST} from 'graphql';
import {WebSocketLink} from 'apollo-link-ws';
import gql from 'graphql-tag'

import { update as updateAction } from '../../redux/graphql' 

export const ALL_EVENTS_QUERY = gql`
  query AllEventsQuery {
    allEvents {
      id
      createdAt
      url
      description
      generatedBy {
        id
        name
      }
    }
    _allEventsMeta {
      count
    }
  }
`;

export const NEW_EVENTS_SUBSCRIPTION = gql`
  subscription {
    Event(filter: {
      mutation_in: [CREATED, UPDATED, DELETED]
    }) {
      mutation
      updatedFields
      previousValues {
        id
      }
      node {
        id
        createdAt
        url
        description
        generatedBy {
          id
          name
        }
      }
    }
  }
`;


export class GraphQLService {
  constructor(redux) {
    this.redux = redux;
    const uri = 'https://api.graph.cool/simple/v1/cja6y0of91uxb0129si4tjkj3';
    const headers = {} // auth here
    const http = new HttpLink({ uri, headers });

    const ws = new WebSocketLink({
      uri: `wss://subscriptions.us-west-2.graph.cool/v1/cja6y0of91uxb0129si4tjkj3`,
      options: {
        reconnect: true,
        // connectionParams: {
        //   //authToken: localStorage.getItem(GC_AUTH_TOKEN),
        // }
      }
    });


    // create Apollo
    this.apollo = new ApolloClient({
      link: ApolloLink.split(
        operation => {
          const operationAST = getOperationAST(operation.query, operation.operationName);
          return !!operationAST && operationAST.operation === 'subscription';
        },
        ws,
        http,
      ),
      cache: new InMemoryCache()
    });
  }
  unsubscribe() {
    if (!this.querySubscription) {
      return
    }
    this.querySubscription && this.querySubscription.unsubscribe && this.querySubscription.unsubscribe();
    this.querySubscription = null;
  }

  subscribe() {
    this.unsubscribe();

    const getQuery = variables => {
      const query = this.apollo.watchQuery({
        query: ALL_EVENTS_QUERY,
        variables
      });

      query.subscribeToMore({
          document: NEW_EVENTS_SUBSCRIPTION,
          updateQuery: (previous, { subscriptionData }) => {

            const { Event: { mutation, node, previousValues } } = subscriptionData.data;
            let newEvents;

            switch (mutation) {
              case 'CREATED':
                newEvents = [node, ...previous.allEvents];
              break;
              case 'DELETED':
                newEvents = (previous.allEvents || []).filter(e => e.id !== previousValues.id)
              break;
              case 'UPDATED':
                const index = (previous.allEvents || []).findIndex(e => e.id === node.id)
                if (index !== -1) {
                  newEvents = [...previous.allEvents]
                  newEvents[index] = node
                }
              break;
            }
            return {
              ...previous,
              allEvents: newEvents
            }
          },
          onError(err) {
            console.log('err', err);
          }
        })

      return query;
    };

    this.querySubscription = getQuery().subscribe((response) => {
      this.redux.dispatch(updateAction({
        data: response.data.allEvents,
        loading: response.loading
      }));
    });
  }
}

GraphQLService.$inject = ['$ngRedux'];