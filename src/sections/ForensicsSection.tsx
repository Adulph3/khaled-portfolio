import { Box, FileSearch, Filter, ScanSearch } from 'lucide-react'
import { SectionHeading } from '../components/SectionHeading'

const packets = [
  { no: '1421', source: '192.168.1.10', destination: '93.184.216.34', protocol: 'TCP', info: 'SYN' },
  { no: '1422', source: '93.184.216.34', destination: '192.168.1.10', protocol: 'TCP', info: 'SYN, ACK' },
  { no: '1426', source: '192.168.1.10', destination: '93.184.216.34', protocol: 'HTTP', info: 'GET /index.html' },
  { no: '1432', source: '93.184.216.34', destination: '192.168.1.10', protocol: 'HTTP', info: '200 OK' },
  { no: '1588', source: '192.168.1.10', destination: '8.8.8.8', protocol: 'DNS', info: 'Standard query A' },
] as const

export function ForensicsSection() {
  return (
    <section className="section section--forensics" id="forensics" aria-labelledby="forensics-title">
      <div className="container">
        <SectionHeading id="forensics-title" index="05" title="Capture The Flag — Network Forensics & Packet Analysis" />
        <div className="forensics-layout" data-reveal>
          <div className="forensics-copy">
            <p>
              I regularly participate in CTF challenges specializing in network forensics and packet
              analysis. I use Wireshark and display filters to isolate traffic, decode protocols,
              extract information from PCAP files, and analyze TCP, UDP, DNS, and HTTP streams for
              anomalies and attack patterns. This work helps me apply both offensive and defensive
              thinking to realistic network scenarios.
            </p>
            <dl>
              <div><dt>File</dt><dd><code>ctf_network_capture.pcap</code></dd></div>
              <div><dt>Protocols</dt><dd><span>TCP</span><span>UDP</span><span>DNS</span><span>HTTP</span></dd></div>
            </dl>
          </div>

          <div className="packet-workbench">
            <div className="packet-filter">
              <Filter aria-hidden="true" size={18} />
              <span>Display Filter</span>
              <code>tcp.stream eq 5</code>
            </div>
            <ol className="investigation-stages" aria-label="Investigation stages">
              <li><ScanSearch aria-hidden="true" size={18} />Isolate</li>
              <li><Box aria-hidden="true" size={18} />Decode</li>
              <li><FileSearch aria-hidden="true" size={18} />Extract</li>
              <li><ScanSearch aria-hidden="true" size={18} />Analyze</li>
            </ol>
            <div className="packet-table-wrap">
              <table>
                <caption className="sr-only">Example packet stream inspection</caption>
                <thead><tr><th>No.</th><th>Source</th><th>Destination</th><th>Protocol</th><th>Info</th></tr></thead>
                <tbody>
                  {packets.map((packet) => (
                    <tr key={packet.no}>
                      <td>{packet.no}</td><td>{packet.source}</td><td>{packet.destination}</td>
                      <td><code>{packet.protocol}</code></td><td>{packet.info}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
