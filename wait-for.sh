#!/bin/sh
# wait-for.sh — проверяет доступность TCP хоста и порта

HOST=""
PORT=""
TIMEOUT=15
QUIET=0

echoerr() {
  if [ "$QUIET" -ne 1 ]; then
    echo "$@" 1>&2
  fi
}

usage() {
  echo "Usage: $0 host:port [-t timeout] [-- command args]" 1>&2
  echo "  -h HOST      Host or IP under test" 1>&2
  echo "  -p PORT      TCP port under test" 1>&2
  echo "  -t TIMEOUT   Timeout in seconds (default 15)" 1>&2
  echo "  -q           Quiet mode" 1>&2
  echo "  -- COMMAND   Execute command after wait succeeds" 1>&2
  exit 1
}

wait_for() {
  echoerr "Waiting up to $TIMEOUT seconds for $HOST:$PORT..."

  start_ts=$(date +%s)
  while :
  do
    (echo > /dev/tcp/$HOST/$PORT) >/dev/null 2>&1
    result=$?
    if [ $result -eq 0 ]; then
      end_ts=$(date +%s)
      echoerr "$HOST:$PORT is available after $((end_ts - start_ts)) seconds"
      return 0
    fi

    now_ts=$(date +%s)
    elapsed=$((now_ts - start_ts))
    if [ $elapsed -ge $TIMEOUT ]; then
      echoerr "Timeout after $TIMEOUT seconds waiting for $HOST:$PORT"
      return 1
    fi
    sleep 1
  done
}

while [ $# -gt 0 ]; do
  case "$1" in
    *:*)
      HOST=${1%:*}
      PORT=${1#*:}
      shift
      ;;
    -h)
      HOST=$2
      shift 2
      ;;
    -p)
      PORT=$2
      shift 2
      ;;
    -t)
      TIMEOUT=$2
      shift 2
      ;;
    -q)
      QUIET=1
      shift
      ;;
    --)
      shift
      CMD="$@"
      break
      ;;
    *)
      usage
      ;;
  esac
done

if [ -z "$HOST" ] || [ -z "$PORT" ]; then
  echoerr "Error: host and port must be specified."
  usage
fi

wait_for
result=$?

if [ $result -ne 0 ]; then
  exit $result
fi

if [ -n "$CMD" ]; then
  exec $CMD
else
  exit 0
fi
