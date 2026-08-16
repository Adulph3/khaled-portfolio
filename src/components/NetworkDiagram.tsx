import { Monitor, Network, Server } from 'lucide-react'

const protocols = ['TCP', 'IP', 'Ethernet', 'DNS', 'SSH'] as const

export function NetworkDiagram() {
  return (
    <div className="network-diagram" aria-hidden="true" data-reveal>
      <div className="network-diagram__route">
        <span className="packet packet--one" />
        <span className="packet packet--two" />
        <span className="packet packet--three" />
      </div>
      <div className="network-nodes">
        <div className="network-node">
          <span className="network-node__icon network-node__icon--ubuntu">
            <Monitor size={30} strokeWidth={1.6} />
          </span>
          <strong>Ubuntu Client</strong>
          <code>10.0.0.10</code>
        </div>
        <div className="network-node network-node--center">
          <span className="network-node__icon">
            <Network size={30} strokeWidth={1.6} />
          </span>
          <strong>Local Network</strong>
          <code>10.0.0.0/24</code>
        </div>
        <div className="network-node">
          <span className="network-node__icon network-node__icon--rocky">
            <Server size={30} strokeWidth={1.6} />
          </span>
          <strong>Rocky Linux Server</strong>
          <code>10.0.0.20</code>
        </div>
      </div>
      <div className="protocol-rail">
        {protocols.map((protocol) => <code key={protocol}>{protocol}</code>)}
      </div>
      <div className="terminal-panel">
        <div className="terminal-panel__bar">
          <span />
          <span />
          <span />
          <code>connectivity_check</code>
        </div>
        <code><span className="terminal-prompt">khaled@client:~$</span> ping 10.0.0.20</code>
        <code>64 bytes from 10.0.0.20: icmp_seq=1 ttl=64</code>
        <code>64 bytes from 10.0.0.20: icmp_seq=2 ttl=64</code>
        <code>3 packets transmitted, 3 received, 0% packet loss</code>
        <code><span className="terminal-prompt">status:</span> route validated</code>
      </div>
    </div>
  )
}
